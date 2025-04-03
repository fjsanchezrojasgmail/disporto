import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { PatientSituation } from '../../../bean/constants';
import {
  SearchPatientFilter,
  SimplePatient
} from '../../../bean/models/patient';

import { GlobalFeedbackService } from '../../global-feedback.service';
import { PatientDaoService } from '../../dao/patient-dao.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private patient: BehaviorSubject<SimplePatient | null> =
    new BehaviorSubject<SimplePatient | null>(null);
  public patient$ = this.patient.asObservable();

  noSacylTitle = '';
  noSacylDetails = '';
  notFound = '';

  constructor(
    private patientDao: PatientDaoService,
    private globalFeedback: GlobalFeedbackService,
    private translate: TranslateService
  ) {
    this.translate
      .get('validation.warning.patient.title')
      .subscribe((data) => (this.noSacylTitle = data));
    this.translate
      .get('validation.warning.patient.noSacyl')
      .subscribe((data) => (this.noSacylDetails = data));
    this.translate
      .get('validation.error.patient.not_found')
      .subscribe((data) => (this.notFound = data));
  }

  getPatient(filter: SearchPatientFilter) {
    return this.patientDao.getPatient(filter).pipe(
      map((data) => {
        if (data) {
          const patient = data.mapToModel();
          if (this.isNoSacylPatient(patient)) {
            this.globalFeedback.showCustomMessage({
              severity: 'info',
              text: this.noSacylTitle,
              //detail: this.noSacylDetails
            });
          } else {
            this.patient.next(patient);
          }
        } else {
          this.globalFeedback.showErrorMessage(this.notFound);
        }
      })
    );
  }

  clearPatient() {
    this.patient.next(null);
  }

  isNoSacylPatient(p: SimplePatient) {
    return (
      p?.situation?.code === PatientSituation.DISPLACED_OUTSIDE ||
      p?.situation?.code === PatientSituation.PASSER_BY
    );
  }

  get patientInfo() {
    if (this.patient.value) return this.patient.value;
    return undefined;
  }
}
