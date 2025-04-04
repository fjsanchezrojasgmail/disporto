import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, switchMap } from 'rxjs';
import { BundleModel } from '../../../bean/fhir-r3/domain/bundle';
import { Bundle } from '../../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { SimplePatient } from '../../../bean/models/patient';
import { PrescriptionAction, PrescriptionVersioned } from '../../../bean/models/prescription';

import { GlobalFeedbackService } from '../../global-feedback.service';
import { BundleDaoService } from '../../dao/bundle-dao.service';

@Injectable({
  providedIn: 'any'
})
export class PrescriptionDetailsService {

  constructor(
    private bundleService: BundleDaoService,
    private translate: TranslateService,
    private globalFeedback: GlobalFeedbackService
  ) { }

  fetchBundle(prescription: PrescriptionVersioned, patient: SimplePatient): Observable<PrescriptionVersioned[] | null> {
    return this.bundleService.getByIdentifier(prescription.id).pipe(
      switchMap(data => {
        const versionId = Number(data?.entry?.at(0)?.resource?.meta?.versionId || '0');
        const prescriptionDetails = {
          ...prescription,
          bundleVersion: (versionId + 1).toString()
        };
        return this.fetchHistory(patient, prescriptionDetails, data?.entry?.at(0)?.resource?.id);
      })
    );
  }

  fetchHistory(patient: SimplePatient, prescription: PrescriptionVersioned, currentBundleId?: string): Observable<PrescriptionVersioned[] | null> {
    if (currentBundleId) {
      return this.bundleService.getHistory(currentBundleId).pipe(
        switchMap(data => {
          const result: PrescriptionVersioned[] = [];
          data?.entry?.forEach(bundle => {
            const resource = bundle.resource as Bundle;
            const bundleObject = new BundleModel(resource);
            const prescription = bundleObject.mapToPrescriptionModel().at(0);
            if (prescription) {
              result.push({
                ...prescription,
                updateDate: resource.meta?.lastUpdated,
                bundleVersion: resource.meta?.versionId
              });
            }
          });
          return of(result.reverse());
        })
      );
    } else {
      this.translate.get('details.error.no_bundle')
        .subscribe(data => this.globalFeedback.showErrorMessage(data));
      return of(null);
    }
  }

  mapPrescriptionsWithActions(history: PrescriptionVersioned[], actions: PrescriptionAction[] = []): PrescriptionVersioned[] {
    const actionsIndex = 0;
    const result = [];
    history.forEach(p => {
      for (let i = actionsIndex; i < actions.length; i++) {
        if (p.status.code === actions[i].state.code) result.push();
      }
    });
    return [];
  }
}
