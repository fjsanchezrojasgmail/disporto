import { EstablishmentDaoService } from './../../dao/establishment-dao.service';
import { EstablishmentMaster, Management, Titular } from './../../../bean/models/billing';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { BillingStates, EstablishmentBillingTypes, MaxPageSize, ProfesionalTypes } from '../../../bean/constants';
import { BundleModel } from '../../../bean/fhir-r3/domain/bundle';
import { BundleEntry } from '../../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { FhirResource } from '../../../bean/fhir-r3/domain/interfaces/common.interface';
import { FhirTypes } from '../../../bean/fhir-r3/fhir-constants';
import { Establishment, Regularisation, RegularisationCodes } from '../../../bean/models/administration';
import { EstablishmentBillingRow, BillingGeneralFilter, EstablishmentBilling, ProvinceBilling, BillingStatePairs, ProvinceBillingCreate } from '../../../bean/models/billing';
import { BillingDispensation } from '../../../bean/models/prescription';
import { getMonth, to2DecimalsNumber } from '../../../utils/utils';
import { ConstantsService } from '../../constants.service';
import { BundleDaoService } from '../../dao/bundle-dao.service';
import { EstablishmentBillingDaoService } from '../../dao/establishment-billing-dao.service';
import { ProvincialBillingDaoService } from '../../dao/provincial-billing-dao.service';
import { RegularisationDaoService } from '../../dao/regularisation-dao.service';
import { GlobalFeedbackService } from '../../global-feedback.service';
import { PdfService } from '../../helpers/pdf.service';
import { ProfesionalService } from '../../helpers/profesional/profesional.service';
import { GeneralBilling, GeneralBillingTable, IndividualBilling, IndividualBillingItem, ProvincialBilling, ProvincialBillingItem, ProvincialBillingRegularizations } from 'src/app/bean/models/pdf-model';
import { RequestGroupDaoService } from '../../dao/request-group-dao.service';
import { criteriaRGBillingByCenter } from 'src/app/bean/fhir-r3/criterias/request-group-criteria';
import { Product } from 'src/app/bean/models/product';

@Injectable({
  providedIn: 'any'
})
export class BillingService {

  private filter: BehaviorSubject<BillingGeneralFilter | null> = new BehaviorSubject<BillingGeneralFilter | null>(null);
  filter$ = this.filter.asObservable();

  private loadingAction: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingAction$ = this.loadingAction.asObservable();

  constructor(private translate: TranslateService,
    private globalFeedback: GlobalFeedbackService,
    private constantsService: ConstantsService,
    private bundleDaoService: BundleDaoService,
    private regularisationDao: RegularisationDaoService,
    private establishmentBillingDaoService: EstablishmentBillingDaoService,
    private provincialBillingDaoService: ProvincialBillingDaoService,
    private establishmentDaoService: EstablishmentDaoService,
    private profesionalService: ProfesionalService,
    private pdfService: PdfService,
    private requestGroupDaoService: RequestGroupDaoService) { }

  initFilterByProfesional() {
    const generalFilter: BillingGeneralFilter = {
      billingType: null,
      month: { code: new Date().getMonth(), description: getMonth(new Date().getMonth()) },
      year: new Date(),
      province: null,
      code: undefined
    };
    const est = this.profesionalService.establishment;
    switch (this.profesionalService.profesional?.typeProfesional) {
      case ProfesionalTypes.DISPENSER_ESTABLISHMENT:
        if (est) {
          generalFilter.billingType = this.constantsService.billingTypes.find(t => t.code === est.codeFact) || null;
          generalFilter.province = { code: est.codeRegion, description: est.descriptionRegion };
          generalFilter.code = est.code;
        }
        break;
      case ProfesionalTypes.ASSOCIATION:
        generalFilter.billingType = this.constantsService.billingTypes.find(t => t.code === EstablishmentBillingTypes.ASSOCIATION) || null;
        generalFilter.province = this.profesionalService.profesional.provinces.at(0) || null;
        break;
      case ProfesionalTypes.PROVINCIAL_COLLEGE:
        generalFilter.billingType = this.constantsService.billingTypes.find(t => t.code === EstablishmentBillingTypes.SCHOOL) || null;
        generalFilter.province = this.profesionalService.profesional.provinces.at(0) || null;
        break;
      case ProfesionalTypes.CONCYL:
        generalFilter.billingType = this.constantsService.billingTypes.find(t => t.code === EstablishmentBillingTypes.SCHOOL) || null;
        generalFilter.province = this.profesionalService.profesional.provinces.at(0) || null;
        break;
      case ProfesionalTypes.AREA_MANAGEMENT:
      case ProfesionalTypes.SSCC_MANAGEMENT:
        generalFilter.billingType = this.constantsService.billingTypes.find(t => t.code === EstablishmentBillingTypes.ASSOCIATION) || null;
        generalFilter.province = this.profesionalService.profesional.provinces.at(0) || null;
        break;
      default:
    }

    return generalFilter;
  }

  generateClosure(
    establishmentBilling: EstablishmentBillingRow | undefined,
    dispensations: BillingDispensation[],
    bundles: BundleModel[] | undefined,
    generalFilter?: BillingGeneralFilter) {

    if (generalFilter && dispensations.length > 0 && establishmentBilling) {
      const bill = establishmentBilling.billing;
      establishmentBilling.billing = {
        ...bill,
        codeFactura: `${bill.codeRegion}-${bill.codeCenter}-${generalFilter.month.code}-${generalFilter.year.getFullYear()}`,
        estadoFacturacion:
          (this.profesionalService.establishment?.codeFact === EstablishmentBillingTypes.INDEPENDENT) ?
            BillingStates.ACCEPTED : BillingStates.PENDING_ACCEPTANCE,
        month: generalFilter.month.code,
        year: generalFilter.year.getFullYear()
      };
      this.loadingAction.next(true);
      this.establishmentBillingDaoService.create(establishmentBilling.billing).subscribe(data => {
        if (data) {
          bundles?.forEach((bundle, index) => {
            const importantDispensation = dispensations.slice(index * MaxPageSize, (index + 1) * MaxPageSize);
            bundle?.addBillingCodes(importantDispensation, establishmentBilling.billing.codeFactura);
            const entries: BundleEntry<FhirResource>[] = [];
            bundle.entry?.forEach(entry => {
              if (FhirTypes.REQUEST_GROUP === entry.resource?.resourceType as FhirTypes) {
                entries.push(entry);
              }
            });
            this.bundleDaoService.updateResource(entries).subscribe((data) => {
              //console.log(data);
            });
          });
        }
        this.loadingAction.next(false);
      });
    } else if (!establishmentBilling) {
      this.translate.get('warning.billing.no_expanded').subscribe(data => this.globalFeedback.showErrorMessage(data));
    } else if (!dispensations || dispensations?.length === 0) {
      this.translate.get('warning.billing.no_dispensations').subscribe(data => this.globalFeedback.showErrorMessage(data));
    }
    else {
      this.translate.get('warning.billing.missing_data').subscribe(data => this.globalFeedback.showErrorMessage(data));
    }
  }

  acceptEstablishmentBilling(bills: EstablishmentBilling[]) {
    if (bills.length > 0 && bills.every(b => b.codeFactura !== undefined)) {
      const newBills: BillingStatePairs[] = [];
      bills.forEach(b => {
        if (b.codeFactura) {
          newBills.push({
            codeFactura: b.codeFactura,
            estadoFacturacion: BillingStates.ACCEPTED
          });
        }
      });
      this.loadingAction.next(true);
      this.establishmentBillingDaoService.stateUpdate(newBills).subscribe(() => {
        this.loadingAction.next(false);
      });
    } else {
      this.globalFeedback.showWarningMessage('billing.error.code_factura');
    }
  }


  acceptProvincialBilling(list: EstablishmentBilling[], generalFilter: BillingGeneralFilter) {
    this.loadingAction.next(true);
    const newBill: ProvinceBillingCreate = {
      ...this.createProvinceBilling(list, generalFilter),
      codFacturasCentros: list.filter(e => e.codeFactura !== undefined).map(e => e.codeFactura!)
    };
    this.provincialBillingDaoService.create(newBill).subscribe(() => {
      this.loadingAction.next(false);
    });
  }

  confirmBilling(list: EstablishmentBilling[]) {
    this.loadingAction.next(true);
    const updateList: BillingStatePairs[] = [];
    list.forEach(elem => {
      if (elem.codeTipoFactura === EstablishmentBillingTypes.INDEPENDENT && elem.codeFactura) {
        updateList.push({ codeFactura: elem.codeFactura, estadoFacturacion: BillingStates.CONFIRMED });
      }
      else if (elem.codeFacturacionProvincial) {
        updateList.push({ codeFacturacionProvincial: elem.codeFacturacionProvincial, estadoFacturacion: BillingStates.CONFIRMED });
      } else {
        this.globalFeedback.showWarningMessage('billing.error.code_factura');
      }
    });
    this.establishmentBillingDaoService.stateUpdate(updateList).subscribe(() => this.loadingAction.next(false));
  }

  billingClosingAssociation(list: EstablishmentBilling[]) {
    this.loadingAction.next(true);
    const updateList: BillingStatePairs[] = [];
    list.forEach(elem => {
      if (elem.codeFacturacionProvincial) {
        updateList.push({ codeFacturacionProvincial: elem.codeFacturacionProvincial, estadoFacturacion: BillingStates.CLOSED });
      } else {
        this.globalFeedback.showWarningMessage('billing.error.code_factura');
      }
    });
    this.establishmentBillingDaoService.stateUpdate(updateList).subscribe(() => this.loadingAction.next(false));
  }

  billingClosingEstablishment(list: EstablishmentBilling[]) {
    this.loadingAction.next(true);
    const updateList: BillingStatePairs[] = list.map(elem => {
      return <BillingStatePairs>{ codeFactura: elem.codeFactura, estadoFacturacion: BillingStates.CLOSED };
    });
    this.establishmentBillingDaoService.stateUpdate(updateList).subscribe(() => this.loadingAction.next(false));
  }

  printIndividualBilling(establishmentBilling: EstablishmentBilling | undefined) {
    this.loadingAction.next(true);
    if (establishmentBilling?.codeCenter && establishmentBilling.codeFactura) {

      this.requestGroupDaoService.search(
        criteriaRGBillingByCenter(
          establishmentBilling?.codeCenter, undefined, establishmentBilling.codeFactura)).subscribe(
            data => {
              if (data) {
                let dispensations = data.mapToPrescriptionModel() as BillingDispensation[];
                dispensations = this.updateTotals(dispensations);
                if (data.link && data.link.length > 1) {
                  const next = data.link.find(e => e.relation === 'next')?.url;
                  if (next) this.recursiveNextPages(next, establishmentBilling, dispensations);
                }
                else this.printIndividual(establishmentBilling, dispensations);

              }
              else {
                this.loadingAction.next(false);
              }
            }
          );

    }
  }

  private updateTotals(dispensations: BillingDispensation[]) {
    return dispensations.map(d => {
      let sumAport = 0;
      let sumPvp = 0;
      let sumPvpTax = 0;
      let sumDiff = 0;
      d.products.map(p => {
        sumAport += (p.userConsideration.realAportation || 0);
        sumPvp += (p.pvp.value || 0) * p.units.value;
        sumPvpTax += (p.pvp.valueTax || 0) * p.units.value;
        sumDiff += this.calcFinalCharge(p);
      });
      return <BillingDispensation>{
        ...d,
        totalAportation: sumAport,
        totalPvp: sumPvp,
        totalPvpTax: sumPvpTax,
        totalDiff: sumDiff
      };
    });
  }

  calcFinalCharge(product: Product) {
    return to2DecimalsNumber((product.pvp.total || 0) - (product.userConsideration.realAportation || 0));
  }

  private recursiveNextPages(url: string, establishmentBilling: EstablishmentBilling | undefined, dispensations: BillingDispensation[]) {
    this.requestGroupDaoService.page(url).subscribe(
      data => {
        if (data) {
          const newSet = data.mapToPrescriptionModel() as BillingDispensation[];
          dispensations = [...dispensations, ...newSet];
          dispensations = this.updateTotals(dispensations);
          if (data.link && data.link.length > 1) {
            const next = data.link.find(bundleLink => bundleLink.relation === 'next')?.url;
            if (next) this.recursiveNextPages(next, establishmentBilling, dispensations);
          }
          else {
            this.printIndividual(establishmentBilling, dispensations);
          }
        }
        else {
          this.loadingAction.next(false);
        }
      }
    );
  }

  private printIndividual(establishmentBilling: EstablishmentBilling | undefined, dispensations: BillingDispensation[]) {
    if (establishmentBilling && dispensations.length > 0) {
      if (establishmentBilling.codeTipoFactura === EstablishmentBillingTypes.INDEPENDENT) {
        this.regularisationDao.search({ facturacionEstablecimientoCode: establishmentBilling.codeFactura }).subscribe(data => {
          if (data) {
            const regularisationTable: ProvincialBillingRegularizations = this.calculateRegularizations(data);
            this.handleIndividualBilling(
              establishmentBilling, dispensations, regularisationTable, establishmentBilling.codeCenter);
            this.loadingAction.next(false);
          }
        });
      }
      else {
        this.handleIndividualBilling(
          establishmentBilling, dispensations, undefined, establishmentBilling.codeCenter),
          this.loadingAction.next(false);
      }
    }
    else {
      this.globalFeedback.showTranslatedErrorMessage('error.billing.accept');
      this.loadingAction.next(false);
    }
  }

  printProvincialBilling(list: EstablishmentBilling[] | undefined) {
    this.loadingAction.next(true);
    if (list) {
      const provinceCode = list?.at(0)?.codeRegion;
      if (provinceCode) {
        switch (list?.at(0)?.codeTipoFactura) {
          case EstablishmentBillingTypes.ASSOCIATION:
            this.establishmentBillingDaoService.searchAsociacion(provinceCode).subscribe(associationData => {
              this.handleProvincialEstablishment(list, associationData);
            });
            break;
          case EstablishmentBillingTypes.SCHOOL:
            this.establishmentBillingDaoService.searchCOF(provinceCode).subscribe(schoolData => {
              this.handleProvincialEstablishment(list, schoolData);
            });
            break;
        }
      }
    }
    else {
      this.globalFeedback.showTranslatedErrorMessage('error.billing.accept');
      this.loadingAction.next(false);
    }
  }

  private handleProvincialEstablishment(list: EstablishmentBilling[], establishmentData: EstablishmentMaster[]) {
    const code = list?.at(0)?.codeFacturacionProvincial;
    if (code && list?.every(e => e.codeFacturacionProvincial === code)) {
      this.regularisationDao.search({ facturacionProvincialCode: code }).subscribe(data => {
        if (data) {
          const regularisationTable: ProvincialBillingRegularizations = this.calculateRegularizations(data);
          this.handleTitularProvincialEstablishment(list, regularisationTable, establishmentData, list[0].codeCenter);
          this.loadingAction.next(false);
        }

        else this.loadingAction.next(false);

      });
    }
  }

  private handleTitularProvincialEstablishment(
    establishmentBilling: EstablishmentBilling[],
    regularizationTable: ProvincialBillingRegularizations,
    establishmentData: EstablishmentMaster[],
    codeCenter: string) {

    this.establishmentBillingDaoService.searchTitular(codeCenter).subscribe(titularData => {
      this.pdfService.createPdfProvincialBilling(
        this.formatToProvincialBillingPDF(establishmentBilling, regularizationTable, establishmentData, titularData));
    });

    this.loadingAction.next(false);

  }


  calculateRegularizations(data: Regularisation[]): ProvincialBillingRegularizations {
    if (data && data.length > 0) {

      let incrementoP = 0;
      let incrementoQ = 0;
      let deduccionP = 0;
      let deduccionQ = 0;

      data.forEach(element => {
        if (element.classification.trim() === 'P') {
          if (element.balance === 'I') {
            incrementoP += element.quantity;
          } else if (element.balance === 'D') {
            deduccionP += element.quantity;
          }
        } else if (element.classification.trim() === 'Q') {
          if (element.balance === 'I') {
            incrementoQ += element.quantity;
          } else if (element.balance === 'D') {
            deduccionQ += element.quantity;
          }
        }
      });

      const totalP = incrementoP - deduccionP;
      const totalQ = incrementoQ - deduccionQ;

      const totalIncremento = incrementoP + incrementoQ;
      const totalDeduccion = deduccionP + deduccionQ;

      const regularizationTable: ProvincialBillingRegularizations = {
        incrementoP: incrementoP,
        incrementoQ: incrementoQ,
        deduccionP: deduccionP,
        deduccionQ: deduccionQ,
        totalDeduccion: totalDeduccion,
        totalIncremento: totalIncremento,
        totalP: totalP,
        totalQ: totalQ,
        total: 0 //El total se calcula en el PDF, porque se necesitan valores que aquí aún no están.
      };

      return regularizationTable;

    } else {
      return {
        incrementoP: 0,
        incrementoQ: 0,
        deduccionP: 0,
        deduccionQ: 0,
        totalDeduccion: 0,
        totalIncremento: 0,
        totalP: 0,
        totalQ: 0,
        total: 0
      };
    }

  }

  printGeneralBilling(list: EstablishmentBilling[]) {
    this.loadingAction.next(true);

    let codeFactura: string;
    let codeCenter: string;

    if (list) {
      const provinceCode = list?.at(0)?.codeRegion;
      if (provinceCode) {
        switch (list?.at(0)?.codeTipoFactura) {
          case EstablishmentBillingTypes.ASSOCIATION:
            codeFactura = list?.at(0)?.codeFacturacionProvincial || '';
            this.establishmentBillingDaoService.searchAsociacion(provinceCode).subscribe(associationData => {
              this.provincialBillingDaoService.searchProvincial(codeFactura).subscribe(provincialData => {
                this.handleGeneralBilling(list, associationData, provinceCode, provincialData, EstablishmentBillingTypes.ASSOCIATION, codeFactura);
              });
            });
            break;
          case EstablishmentBillingTypes.SCHOOL:
            codeFactura = list?.at(0)?.codeFacturacionProvincial || '';
            this.establishmentBillingDaoService.searchCOF(provinceCode).subscribe(schoolData => {
              this.provincialBillingDaoService.searchProvincial(codeFactura).subscribe(provincialData => {
                this.handleGeneralBilling(list, schoolData, provinceCode, provincialData, EstablishmentBillingTypes.SCHOOL, codeFactura);
              });
            });
            break;

          case EstablishmentBillingTypes.INDEPENDENT:
            codeFactura = list?.at(0)?.codeFactura || '';
            codeCenter = list?.at(0)?.codeCenter || '';
            this.establishmentDaoService.search({ code: codeCenter }).subscribe(schoolData => {
              this.establishmentBillingDaoService.searchEstablishment(codeFactura).subscribe(establishmentData => {
                this.handleGeneralBilling(list, schoolData, provinceCode, establishmentData, EstablishmentBillingTypes.INDEPENDENT, codeFactura);
              });
            });
            break;
        }
      }
    }
    else {
      this.globalFeedback.showTranslatedErrorMessage('error.billing.accept');
      this.loadingAction.next(false);
    }

  }

  private handleGeneralBilling(
    list: EstablishmentBilling[],
    establishmentData: EstablishmentMaster[] | Establishment[],
    provinceCode: string,
    data: ProvinceBilling[] | EstablishmentBilling[],
    establishmentBillingType: string,
    codeFactura: string) {

    this.establishmentBillingDaoService.searchGerencia(provinceCode).subscribe(managementData => {
      if (establishmentBillingType === EstablishmentBillingTypes.INDEPENDENT) {
        this.regularisationDao.search({ facturacionEstablecimientoCode: codeFactura }).subscribe(regularisationData => {
          this.pdfService.createPdfGeneralBilling(
            this.formatToGeneralBillingPDF(
              list, establishmentData, managementData, data, establishmentBillingType, this.calculateRegularizations(regularisationData)
            )
          );
        });
      }
      else {
        this.regularisationDao.search({ facturacionProvincialCode: codeFactura }).subscribe(regularisationData => {
          this.pdfService.createPdfGeneralBilling(
            this.formatToGeneralBillingPDF(
              list, establishmentData, managementData, data, establishmentBillingType, this.calculateRegularizations(regularisationData)
            )
          );
        });
      }

    });
    this.loadingAction.next(false);
  }

  private handleIndividualBilling(
    establishmentBilling: EstablishmentBilling,
    dispensations: BillingDispensation[],
    regularisationTable: ProvincialBillingRegularizations | undefined,
    codeCenter: string) {

    this.establishmentBillingDaoService.searchTitular(codeCenter).subscribe(titularData => {
      this.pdfService.createPdfIndividualBilling(
        this.formatToIndividualBillingPDF(establishmentBilling, dispensations, regularisationTable, titularData),
        establishmentBilling.codeTipoFactura);
    });

    this.loadingAction.next(false);

  }

  formatToIndividualBillingPDF(
    establishmentBilling: EstablishmentBilling,
    dispensations: BillingDispensation[],
    regularisationTable: ProvincialBillingRegularizations | undefined,
    titularData: Titular[]): IndividualBilling {

    let nombreApellidos = '';
    if (titularData && titularData[0])
      nombreApellidos = `${titularData[0].profesionalName} ${titularData[0].apellido1} ${titularData[0].apellido2}`;

    const prescripcion: IndividualBillingItem[] = [];
    dispensations.map(d => {
      prescripcion.push(
        ...d.products.map(p => <IndividualBillingItem>{
          idPrescripcion: d.id,
          codTipoProducto: p.code,
          numProductos: p.units.value,
          precioFacturacion: p.pvp.total,
          aportacion: p.userConsideration.realAportation,
          gastoFinal: (p.pvp.total || 0) - (p.userConsideration.realAportation || 0)
        })
      );
    });

    const result: IndividualBilling = {
      idFactura: establishmentBilling.codeFactura || '',
      mesFactura: establishmentBilling.month.toString(),
      añoFactura: establishmentBilling.year.toString(),
      idEstablecimiento: establishmentBilling.codeCenter,
      titular: nombreApellidos,
      fechaCierre: this.formatFechaCierre(establishmentBilling.dateTo || ''),
      provincia: establishmentBilling.descriptionRegion +
        ` (${establishmentBilling.codeRegion})`,
      prescripcion,
      totalProductos: establishmentBilling.totalProductos,
      totalFacturacion: establishmentBilling.totalFacturar,
      totalAportacion: establishmentBilling.totalAportacion,
      totalGasto: establishmentBilling.totalGasto,
      tablaRegularizacion: regularisationTable
    };

    return result;
  }

  private formatToProvincialBillingPDF(
    establishmentBilling: EstablishmentBilling[],
    regularizationTable: ProvincialBillingRegularizations,
    establishmentData: EstablishmentMaster[],
    titularData: Titular[]): ProvincialBilling {

    let nombreApellidos = '';
    if (titularData && titularData[0])
      nombreApellidos = `${titularData[0].profesionalName} ${titularData[0].apellido1} ${titularData[0].apellido2}`;

    const prescripcion: ProvincialBillingItem[] = establishmentBilling.map(billing => {
      return {
        codEstablecimiento: billing.codeCenter,
        numProductos: billing.totalProductos,
        importeFacturacion: billing.totalFacturar,
        aportacion: billing.totalAportacion,
        gastoFinal: billing.totalGasto
      };
    });

    let cif = '';
    let nombreEstablecimiento = '';

    if (establishmentData) {
      cif = establishmentData[0].cif;
      nombreEstablecimiento = establishmentData[0].cof;
    }

    const firstBilling = establishmentBilling[0];

    const result: ProvincialBilling = {
      idFactura: firstBilling.codeFacturacionProvincial || '',
      mesFactura: firstBilling.month.toString(),
      añoFactura: firstBilling.year.toString(),
      tipoFacturacion: firstBilling.codeTipoFactura,
      provincia: nombreEstablecimiento,
      prescripcionCentro: prescripcion,
      regularizationTable: regularizationTable,
      cif: cif,
      usuario: nombreApellidos,
      subtotalProductos: 0,
      subtotalImporte: 0,
      subtotalAportacion: 0,
      subtotalGasto: 0
    };

    return result;
  }

  private formatToGeneralBillingPDF(
    list: EstablishmentBilling[],
    establishmentData: EstablishmentMaster[] | Establishment[],
    managementData: Management[],
    tableData: ProvinceBilling[] | EstablishmentBilling[],
    establishmentBillingType: string,
    regularisationTable: ProvincialBillingRegularizations): GeneralBilling {

    let regularisationTableFinal: ProvincialBillingRegularizations = {
      incrementoP: 0,
      incrementoQ: 0,
      deduccionP: 0,
      deduccionQ: 0,
      totalP: 0,
      totalQ: 0,
      totalIncremento: 0,
      totalDeduccion: 0,
      total: 0
    };

    let table: GeneralBillingTable = {
      numPresP: 0,
      numPresQ: 0,
      numProdP: 0,
      numProdQ: 0,
      importeFacturaP: 0,
      importeFacturaQ: 0,
      aporteP: 0,
      aporteQ: 0,
      gastoFinalP: 0,
      gastoFinalQ: 0,
      totalNumPres: 0,
      totalNumProd: 0,
      totalImporteFactura: 0,
      totalAporte: 0,
      totalGastoFinal: 0
    };

    if (regularisationTable) regularisationTableFinal = regularisationTable;

    if (tableData && tableData.length > 0) {
      table = {
        numPresP: tableData[0].totalPrescripcionesP || 0,
        numPresQ: tableData[0].totalPrescripcionesQ || 0,
        numProdP: tableData[0].totalProductosP || 0,
        numProdQ: tableData[0].totalProductosQ || 0,
        importeFacturaP: tableData[0].totalFacturarP || 0,
        importeFacturaQ: tableData[0].totalFacturarQ || 0,
        aporteP: tableData[0].totalAportacionP || 0,
        aporteQ: tableData[0].totalAportacionQ || 0,
        gastoFinalP: tableData[0].totalGastoP || 0,
        gastoFinalQ: tableData[0].totalGastoQ || 0,
        totalNumPres: (tableData[0].totalPrescripcionesP + tableData[0].totalPrescripcionesQ) || 0,
        totalNumProd: (tableData[0].totalProductosP + tableData[0].totalProductosQ) || 0,
        totalImporteFactura: tableData[0].totalFacturar || 0,
        totalAporte: tableData[0].totalAportacion || 0,
        totalGastoFinal: tableData[0].totalGasto + (regularisationTable.totalIncremento - regularisationTable.totalDeduccion) || 0
      };
    }

    let origen = '';
    let cifOrigen = '';
    let direccionOrigen = '';
    let provincia = '';
    let cifProvincia = '';
    let direccionProvincia = '';
    let idFactura = '';


    if (establishmentData) {
      if (establishmentBillingType === EstablishmentBillingTypes.SCHOOL ||
        establishmentBillingType === EstablishmentBillingTypes.ASSOCIATION) {
        const establishmentMaster: EstablishmentMaster = (establishmentData[0] as EstablishmentMaster);
        origen = establishmentMaster.cof || '';
        cifOrigen = establishmentMaster.cif || '';
        direccionOrigen = establishmentMaster.direccion || '';
        idFactura = list[0].codeFacturacionProvincial || tableData[0].codeFactura || '';

      }

      if (establishmentBillingType === EstablishmentBillingTypes.INDEPENDENT) {
        origen = establishmentData[0].centerName || '';
        cifOrigen = establishmentData[0].cif || '';
        direccionOrigen = establishmentData[0].address || '';
        idFactura = list[0].codeFactura || '';
      }
    }

    if (managementData) {
      provincia = managementData[0].gerencia || '';
      cifProvincia = managementData[0].cif || '';
      direccionProvincia = managementData[0].direccion || '';
    }

    const result: GeneralBilling = {
      origen: origen,
      cifOrigen: cifOrigen,
      direccionOrigen: direccionOrigen,
      idFactura: idFactura,
      fecha: formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss', 'es'),
      fechaCierre: this.formatFechaCierre(tableData[0].dateTo || ''),
      provincia: provincia,
      cifProvincia: cifProvincia,
      direccionProvincia: direccionProvincia,
      tablaGasto: table,
      regularisationTable: regularisationTableFinal

    };

    return result;

  }

  checkExistAssociated(filter: RegularisationCodes) {
    return this.regularisationDao.searchAssociated(filter);
  }

  private createProvinceBilling(list: EstablishmentBilling[], filter: BillingGeneralFilter): ProvinceBilling {
    const codeAC = (filter.billingType?.code === EstablishmentBillingTypes.ASSOCIATION) ? 'A' : 'C';
    const result: ProvinceBilling = {
      codeFactura: `${filter.province?.code}-${codeAC}-${filter.month.code}-${filter.year.getFullYear()}`,
      month: filter.month.code,
      year: filter.year.getFullYear(),
      dni: this.profesionalService.profesional.dni,
      dateTo: formatDate(new Date(), 'dd/MM/yyyy hh:mm:ss', 'es'),
      estadoFacturacion: BillingStates.ACCEPTED,
      codeTipoFactura: filter.billingType?.code || '',
      codeRegion: filter.province?.code || '',
      descriptionRegion: filter.province?.description || '',
      totalAportacion: 0,
      totalAportacionP: 0,
      totalAportacionQ: 0,
      totalFacturar: 0,
      totalFacturarP: 0,
      totalFacturarQ: 0,
      totalGasto: 0,
      totalGastoP: 0,
      totalGastoQ: 0,
      totalPrescripciones: 0,
      totalPrescripcionesP: 0,
      totalPrescripcionesQ: 0,
      totalProductos: 0,
      totalProductosP: 0,
      totalProductosQ: 0,
      totalFacturacionRegularizacion: 0
    };
    list.forEach(e => {
      result.totalAportacion += e.totalAportacion || 0;
      result.totalAportacionP += e.totalAportacionP || 0;
      result.totalAportacionQ += e.totalAportacionQ || 0;
      result.totalFacturar += e.totalFacturar || 0;
      result.totalFacturarP += e.totalFacturarP || 0;
      result.totalFacturarQ += e.totalFacturarQ || 0;
      result.totalGasto += e.totalGasto || 0;
      result.totalGastoP += e.totalGastoP || 0;
      result.totalGastoQ += e.totalGastoQ || 0;
      result.totalPrescripciones += e.totalPrescripciones || 0;
      result.totalPrescripcionesP += e.totalPrescripcionesP || 0;
      result.totalPrescripcionesQ += e.totalPrescripcionesQ || 0;
      result.totalProductos += e.totalProductos || 0;
      result.totalProductosP += e.totalProductosP || 0;
      result.totalProductosQ += e.totalProductosQ || 0;
    });
    return result;
  }

  // Función auxiliar para formatear la fecha si es válida
  formatFechaCierre(dateTo: string): string {
    // Verificar si dateTo es una cadena no vacía y es una fecha válida
    const parsedDate = new Date(dateTo);
    const isValid = !isNaN(parsedDate.getTime());

    return dateTo && isValid
      ? formatDate(dateTo, 'dd/MM/yyyy HH:mm:ss', 'es')
      : '';
  }

}
