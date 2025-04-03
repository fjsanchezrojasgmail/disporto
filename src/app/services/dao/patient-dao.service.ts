import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PatientModel } from '../../bean/fhir-r3/domain/patient';
import { Patient } from '../../bean/fhir-r3/domain/interfaces/patient.interface';
import { HttpService } from '../http.service';
import { PatientDao } from './interfaces/patient-dao.interface';
import { SearchPatientFilter } from '../../bean/models/patient';
import { Bundle } from '../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { FhirTypes } from '../../bean/fhir-r3/fhir-constants';

@Injectable({
  providedIn: 'root'
})
export class PatientDaoService implements PatientDao {

  private apiUrl = '/api/hdr/fhir/Patient';

  constructor(private http: HttpService) { }

  getPatient(filter: SearchPatientFilter): Observable<PatientModel | null> {
    return this.http.post<Bundle<Patient>, Record<string, string>>('/api/rest/findPatient', filter).pipe(map(value => {
      const patientResource = value?.entry?.map(e => e.resource).find(r => r?.resourceType === FhirTypes.PATIENT);
      if (patientResource) return new PatientModel(patientResource);
      return null;
    }));
  }
}
