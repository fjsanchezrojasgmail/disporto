import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AtnaRegistrationConstants, PrescriptionState, RevisionCodes } from '../../../bean/constants';
import { criteriaRGModifications } from '../../../bean/fhir-r3/criterias/request-group-criteria';
import { BundleModel } from '../../../bean/fhir-r3/domain/bundle';
import { Bundle, BundleEntry } from '../../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { FhirResource } from '../../../bean/fhir-r3/domain/interfaces/common.interface';
import { RequestGroup } from '../../../bean/fhir-r3/domain/interfaces/request-group.interface';
import { FhirTypes } from '../../../bean/fhir-r3/fhir-constants';
import { SimplePatient } from '../../../bean/models/patient';
import { mapPrescriptions, Prescription, PrescriptionAction, PrescriptionRow } from '../../../bean/models/prescription';
import { ConstantsService } from '../../constants.service';
import { BundleDaoService } from '../../dao/bundle-dao.service';

import { GlobalFeedbackService } from '../../global-feedback.service';
import { AtnaRegistrationService } from '../../helpers/auditoria/atna-registration.service';
import { ProfesionalService } from '../../helpers/profesional/profesional.service';
import { RequestGroupDaoService } from '../../dao/request-group-dao.service';

@Injectable({
  providedIn: 'any'
})
export class ModificationsService {

  private originalData?: BundleModel;

  private prescriptions: BehaviorSubject<PrescriptionRow[]> = new BehaviorSubject<PrescriptionRow[]>([]);
  prescriptions$ = this.prescriptions.asObservable();


  private dispensePrescriptions: BehaviorSubject<PrescriptionRow[]> = new BehaviorSubject<PrescriptionRow[]>([]);
  private reservePrescriptions: BehaviorSubject<PrescriptionRow[]> = new BehaviorSubject<PrescriptionRow[]>([]);
  private blockPrescriptions: BehaviorSubject<PrescriptionRow[]> = new BehaviorSubject<PrescriptionRow[]>([]);

  dispensePrescriptions$ = this.dispensePrescriptions.asObservable();
  reservePrescriptions$ = this.reservePrescriptions.asObservable();
  blockPrescriptions$ = this.blockPrescriptions.asObservable();

  bundleNotFound = '';

  constructor(private requestGroupDaoService: RequestGroupDaoService,
    private bundleDaoService: BundleDaoService,
    private profesionalService: ProfesionalService,
    private atnaRegistrationService: AtnaRegistrationService,
    private translate: TranslateService,
    private feedbackService: GlobalFeedbackService,
    private constantService: ConstantsService) {
    this.translate.get('error.modification.bundle_not_found').subscribe(data => this.bundleNotFound = data);
  }

  fetchModificableProducts(patient: SimplePatient) {
    this.requestGroupDaoService.search(criteriaRGModifications(patient.id, this.profesionalService.secureEstablishment.code, new Date()))
      .subscribe((data) => {
        if (data) {
          this.originalData = data;
          const allPrescriptions = mapPrescriptions(data.mapToPrescriptionModel()).filter(
            p => {
              switch (p.status.code) {
                case PrescriptionState.PRESC_DISPENSADA:
                case PrescriptionState.PRESC_PDTE_VALIDACION:
                case PrescriptionState.PRESC_PDTE_NUEVAVALIDACION:
                  return this.modifiableDispensableRow(p);
                case PrescriptionState.PRESC_RESERVADA:
                  return this.modifiableReserveRow(p);
                case PrescriptionState.PRESC_BLOQUEO_CAUTELAR:
                  return this.modifiableBlockRow(p);
                default:
                  return false;
              }
            }
          );
          this.prescriptions.next(allPrescriptions);
        }
      });
  }

  considerProducts(id: string, value: boolean) {
    this.prescriptions.next(this.blockPrescriptions.value.map(p => {
      if (p.id === id) p.consider = value;
      return p;
    }));
  }

  expandProducts(id: string) {
    this.prescriptions.next(this.prescriptions.value.map(p => {
      if (p.id === id) p.expanded = !p.expanded;
      return p;
    }));
  }

  undoPrescriptions(patient: SimplePatient) {
    const pedingUpdates: BundleEntry<FhirResource>[] = [];
    const list = this.prescriptions.value.filter(p => p.consider);
    list.forEach(p => {
      this.getBundle(p.id).subscribe(lastBundle => {
        if (lastBundle && lastBundle.id) {
          this.undoFromHistory(lastBundle.id).subscribe(reverdBundle => {
            if (reverdBundle) {
              const entries: BundleEntry<FhirResource>[] = [];
              reverdBundle.addMissingActions(
                p.id,
                (this.originalData?.entry?.find(e => e.resource?.id === p.id)?.resource as RequestGroup).action || []);
              reverdBundle.entry?.forEach(entry => {
                if ([FhirTypes.REQUEST_GROUP, FhirTypes.DEVICE, FhirTypes.DEVICE_REQUEST].includes(entry.resource?.resourceType as FhirTypes)) {
                  entries.push(entry);
                }
              });
              if (entries) pedingUpdates.push(...entries);
              const end = list.every(l => pedingUpdates?.some(e => e.resource?.id === l.id));
              if (end) {
                this.bundleDaoService.updateResource(pedingUpdates).subscribe(() => {
                  if (reverdBundle) {
                    this.bundleDaoService.update(p.id, reverdBundle);
                    //TODO aqui añadir el registro atna
                  }
                  this.fetchModificableProducts(patient);
                });
              }
            } else this.feedbackService.showErrorMessage(this.bundleNotFound);
          });
        } else this.feedbackService.showErrorMessage(this.bundleNotFound);
      });
    });
  }

  modifiableDispensableRow(pres: Prescription) {
    const date = (new Date().getTime() - this.constantService.modificationDispendThreshold * 60 * 60 * 1000);
    const presDate = pres.dispenseDate?.getTime() || 0;
    if (date < presDate && pres.revision?.code !== RevisionCodes.APPROVED && pres.revision?.code !== RevisionCodes.DENIED) {
      return true;
    }
    return false;
  }

  modifiableReserveRow(pres: Prescription) {
    const date = (new Date().getTime() - this.constantService.modificationReserveThreshold * 60 * 60 * 1000);
    let action: PrescriptionAction | undefined;
    pres.actions?.forEach(a => {
      if (a.state.code === PrescriptionState.PRESC_RESERVADA) action = a;
    });
    const presDate = action?.date.getTime() || 0;
    if (date < presDate && pres.revision?.code !== RevisionCodes.DENIED) {
      return true;
    }
    return false;
  }

  modifiableBlockRow(pres: Prescription) {
    const date = (new Date().getTime() - this.constantService.modificationReserveThreshold * 60 * 60 * 1000);
    let action: PrescriptionAction | undefined;
    pres.actions?.forEach(act => {
      if (act.state.code === PrescriptionState.PRESC_BLOQUEO_CAUTELAR) action = act;
    });
    const presDate = action?.date.getTime() || 0;
    if (date < presDate) return true;
    return false;
  }

  private undoFromHistory(bundleId: string): Observable<BundleModel | null> {
    return this.bundleDaoService.getHistory(bundleId).pipe(map(
      data => {
        for (const entry of data?.entry?.reverse() || []) {
          if (entry.resource) {
            const statusCode = new BundleModel(entry.resource).mapToPrescriptionModel().at(0)?.status.code;
            if (statusCode === PrescriptionState.PRESC_PDTE_DISPENSAR) {
              return new BundleModel(entry.resource);
            }
          }
        }
        return null;
      }));
  }

  private getBundle(id: string): Observable<BundleModel | null> {
    return this.bundleDaoService.getByIdentifier(id).pipe(map(data => {
      const resource = data?.entry?.at(0)?.resource as Bundle;
      return new BundleModel(resource);
    }
    ));
  }

  //*************CREACION DE REGISTROS DE AUDITORIA POR MODIFICACION ***************/
  private createRegAtna(prescription: Prescription, patient: SimplePatient, auditCode: string, auditDisplay: string) {

    //****************************Creacion de registro de auditoria por prescripcion dispensada**********************************//
    // Montamos la acción
    const actionModificationSSCCPrescription = {
      action: AtnaRegistrationConstants.ACTION_CREATE,
      code: auditCode,
      display: auditDisplay
    };

    // Llamamos service
    /* this.atnaRegistrationService.callAuditCreate(
      arrResources,
      patient,
      actionModificationSSCCPrescription,
      this.urlHnreq
    ); */
  }
}
