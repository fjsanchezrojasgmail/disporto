import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { BlockEvent } from '../../../bean/simple.types';
import { prescriptionDisplay as PrescriptionDisplay, PrescriptionState, PrescriptionTypes, ProductBasicType, ProductTypes } from '../../../bean/constants';
import { criteriaRGDispensableProducts } from '../../../bean/fhir-r3/criterias/request-group-criteria';
import { BundleModel } from '../../../bean/fhir-r3/domain/bundle';
import { SimplePatient } from '../../../bean/models/patient';
import { mapPrescriptions, Prescription, PrescriptionRow } from '../../../bean/models/prescription';
import { pvpError } from '../../../utils/utils';
import { ConstantsService } from '../../constants.service';
import { BundleDaoService } from '../../dao/bundle-dao.service';

import { GlobalFeedbackService } from '../../global-feedback.service';
import { ProfesionalService } from '../../helpers/profesional/profesional.service';
import { Product } from '../../../bean/models/product';
import { Coding } from '../../../bean/fhir-r3/domain/interfaces/common.interface';
import { CustodiaService } from '../../helpers/custodia/custodia.service';
import { WacomService } from '../../helpers/wacom-service/wacom.service';
import { RequestGroupDaoService } from '../../dao/request-group-dao.service';

@Injectable({
  providedIn: 'any'
})
export class DispensableProductsService {

  private originalData?: BundleModel;
  private prescriptions: BehaviorSubject<PrescriptionRow[]> = new BehaviorSubject<PrescriptionRow[]>([]);
  prescriptions$ = this.prescriptions.asObservable();

  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  private error = {
    title: '',
    message: ''
  };

  constructor(
    private requestGroupDaoService: RequestGroupDaoService,
    private profesionalService: ProfesionalService,
    private bundleDaoService: BundleDaoService,
    private constantsService: ConstantsService,
    private translate: TranslateService,
    private feedbackService: GlobalFeedbackService,
    private custodiaService: CustodiaService,
    private wacomService: WacomService) {
    this.translate.get('mapping.error.title').subscribe(data => this.error.title = data);
    this.translate.get('mapping.error.message').subscribe(data => this.error.message = data);
  }

  fetchDispensableProducts(patient: SimplePatient) {
    this.loading.next(true);
    // Se ponen paginacion a 50 por que no se quiere paginas y se quieren todos los resultados
    this.requestGroupDaoService.search(criteriaRGDispensableProducts(patient.id, '50')).subscribe((data) => {
      if (data) {
        this.originalData = data;
        this.prescriptions.next(
          mapPrescriptions(
            data.mapToPrescriptionModel()).map(
              p => <PrescriptionRow>{
                ...p,
                consider: this.considerDispensableRow(p),
                products: p.products.map(p => this.considerProduct(p))
              }
            ).sort(
              (p1, p2) => this.prescriptionOrder(p1) - this.prescriptionOrder(p2)
            )
        );
      }
      this.loading.next(false);
    });
  }

  savePrescriptionRows(prescriptions: PrescriptionRow[]) {
    this.prescriptions.next(mapPrescriptions(prescriptions));
  }

  expandProducts(code: string) {
    this.prescriptions.next(this.prescriptions.value.map(p => {
      if (p.id === code) p.expanded = !p.expanded;
      return p;
    }));
  }

  considerDispensableRow(pres: Prescription) {
    let considerState = !this.disableDispensableRow(pres);

    if (this.constantsService.selectCommercialBrand && considerState) {
      if (pres.products.some(p => !p.brand)) considerState = false;
      else considerState = true;
    }
    return considerState;
  }

  disableDispensableRow(pres: Prescription) {
    let disable = true;
    if (pres.status.code === PrescriptionState.PRESC_PDTE_DISPENSAR) disable = false;
    if (pres.status.code === PrescriptionState.PRESC_RESERVADA && pres.dispensingCenter?.code === this.profesionalService.secureEstablishment.code) {
      disable = false;
    }
    if (!disable) {
      disable = pres.products.every(p => !p.consider);
    }
    return disable;
  }

  considerProduct(product: Product) {

    switch (this.profesionalService.secureEstablishment.typeProduct) {
      case ProductTypes.ALL:
        product.consider = true;
        break;
      case ProductTypes.BASIC:
        product.consider = product.elaboration === ProductBasicType;
        break;
      case ProductTypes.HEADSET:
        product.consider = product.headset;
        break;
      case ProductTypes.EYES:
        product.consider = product.eyes;
        break;
      case ProductTypes.EYES_HEADSET:
        product.consider = product.eyes || product.headset;
        break;
      case ProductTypes.BASIC_EYES_HEADSET:
        product.consider = product.eyes || product.headset || product.elaboration === ProductBasicType;
        break;
      default:
        product.consider = false;
        break;
    }
    if (!product.consider) product.units.value = 0;
    return product;
  }

  dispensePrescription(prescriptions: Prescription[], patient: SimplePatient,pdfbase64?: string) {
    prescriptions = prescriptions.map(p => {
      if (!p.revision?.required) {
        return this.mapDispensedPrescription(p, PrescriptionState.PRESC_DISPENSADA);
      } if (p.revision?.required && !p.hasValidation) {
        this.originalData?.addOrRefreshValidityDate(p.id, this.constantsService.daysOfMaxValidityDate);
        return this.mapDispensedPrescription(p, PrescriptionState.PRESC_PDTE_VALIDACION);
      }
      this.originalData?.addOrRefreshValidityDate(p.id, this.constantsService.daysOfMaxValidityDate);
      return this.mapDispensedPrescription(p, PrescriptionState.PRESC_PDTE_NUEVAVALIDACION);
    });
    this.originalData?.addDispensationExtensions(prescriptions);
    prescriptions.forEach(p => this.originalData?.addEntryAction(p, this.profesionalService.profesionalReference, this.codingEstablishment));
    this.updateBundle(prescriptions, patient,pdfbase64);
    //TODO ATNA dispensacion
  }

  reservePrescription(prescription: Prescription, patient: SimplePatient) {
    prescription = { ...prescription, status: this.getStatusByCode(PrescriptionState.PRESC_RESERVADA) };
    this.originalData?.addEntryAction(prescription, this.profesionalService.profesionalReference, this.codingEstablishment);
    this.updateBundle([prescription], patient);
    //TODO ATNA reservar
  }

  blockPrescription(patient: SimplePatient, block: BlockEvent) {
    const prescription = { ...block.prescription, status: this.getStatusByCode(PrescriptionState.PRESC_BLOQUEO_CAUTELAR) };
    this.originalData?.addOrRefreshValidityDate(prescription.id, this.constantsService.daysOfMaxValidityDate);
    this.originalData?.addBlockExtension({ ...block, prescription }, this.profesionalService.profesionalReference, this.codingEstablishment);
    this.updateBundle([prescription], patient);
    //TODO ATNA bloqueo
  }

  updateBundle(prescriptions: Prescription[], patient: SimplePatient, pdfbase64?: string) {
    const result = this.originalData?.updateDataByPrescriptions(prescriptions, this.codingEstablishment);
    if (result) {
      this.bundleDaoService.updateResource(result).subscribe(() => {
        if (this.originalData) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          prescriptions.forEach(p => this.bundleDaoService.update(p.id, this.originalData!)); // Se pone ! por que se verifica antes que no sea null.
        }
        const payedPrescription = prescriptions.filter(p=>p.payed);

        if(pdfbase64 && payedPrescription.length > 0){

           this.custodiaService.sendDispensationDocument(pdfbase64,payedPrescription).subscribe(data=>{
            if(!data){
              console.log("Fallo en el envio documento custodia");
            }else{

              this.wacomService.resetPdf();
              this.fetchDispensableProducts(patient);
            }
           });
        }else{
          this.fetchDispensableProducts(patient);
        }


      });
    }
    else {
      this.feedbackService.showCustomMessage({ severity: 'error', text: this.error.message });
      this.fetchDispensableProducts(patient);
    }
  }

  updateProducts(prescription: Prescription, products: Product[]) {
    this.prescriptions.next(this.prescriptions.value.map(p => {
      if (p.id === prescription.id) {
        return {
          ...p,
          products: products
        };
      }
      else return p;
    }));
  }

  private mapDispensedPrescription(p: Prescription, state: PrescriptionState) {
    return <Prescription>{
      ...p,
      status: this.getStatusByCode(state),
      payed: true,
      reimbursement: p.reimbursement || this.applyToPARECYLBILLING(p),
      dispenseDate: p.dispenseDate || new Date()
    };
  }

  private getStatusByCode(code: PrescriptionState) {
    return { code: code, display: PrescriptionDisplay[code] || '' };
  }

  validatePrescriptions(prescriptions: Prescription[]) {
    const brandErros = this.constantsService.selectCommercialBrand && prescriptions.some(p => {
      return p.products.some(p => !p.brand);
    });
    if (brandErros) {
      this.translate.get('validation.error.brand').subscribe(data => this.feedbackService.showErrorMessage(data));
    }
    const pvpErrors = prescriptions.some(p => {
      return p.products.some(prod => {
        return pvpError(prod);
      });
    });
    if (pvpErrors) {
      this.translate.get('validation.error.pvp').subscribe(data => this.feedbackService.showErrorMessage(data));
    }
    return pvpErrors || brandErros;
  }

  private applyToPARECYLBILLING(p: Prescription) {
    return p.type.code === PrescriptionTypes.REC || p.type.code === PrescriptionTypes.REP || p.products.some(p => p.reimbursement);
  }

  private prescriptionOrder(p: PrescriptionRow) {
    switch (p.status.code) {
      case PrescriptionState.PRESC_PDTE_DISPENSAR:
        return 0;
      case PrescriptionState.PRESC_RESERVADA:
        return 5;
      default:
        return 10;
    }
  }

  private get codingEstablishment() {
    return <Coding>{
      code: this.profesionalService.secureEstablishment.code,
      display: this.profesionalService.secureEstablishment.centerName
    };
  }
}
