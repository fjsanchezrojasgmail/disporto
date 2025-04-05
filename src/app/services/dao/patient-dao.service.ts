import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { PatientModel } from '../../bean/fhir-r3/domain/patient';
import { Patient } from '../../bean/fhir-r3/domain/interfaces/patient.interface';
import { HttpService } from '../http.service';
import { PatientDao } from './interfaces/patient-dao.interface';
import { SearchPatientFilter } from '../../bean/models/patient';
import { Bundle } from '../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { FhirTypes, Gender } from '../../bean/fhir-r3/fhir-constants';
import { HumanName } from 'fhir/r3';

@Injectable({
  providedIn: 'root'
})
export class PatientDaoService implements PatientDao {

  private apiUrl = '/api/hdr/fhir/Patient';

  constructor(private http: HttpService) { }

  getPatient(filter: SearchPatientFilter): Observable<PatientModel | null> {
    /*return this.http.post<Bundle<Patient>, Record<string, string>>('/api/rest/findPatient', filter).pipe(map(value => {
      const patientResource = value?.entry?.map(e => e.resource).find(r => r?.resourceType === FhirTypes.PATIENT);
      if (patientResource) return new PatientModel(patientResource);
      return null;
    }));*/
    console.log("PatientDaoService: ", this.patient);
    return of(this.patient);
  }

 

 

  private patient: PatientModel = {
    resourceType: "Patient",
    id: "example-patient-001",
    mapToFhir: () => {
      return {
        resourceType: "Patient",
        id: "mapped-from-model",
        "name": [
      {
        "resourceType": "HumanName",
        "use": "official",
        "family": "Donald",
        "given": [
          "Duck"
        ]
      } 
    ],
      };
    },
    mapToModel: () => {
      return {
        "id": "pat1",
        "disability":0,
        "birthDate" : "1990-01-01",
        "name": "Pedro Perez"
      };
    },
    identifier: [
      {
        use: "usual",
        type: {
          coding: [
            {
              system: "http://hl7.org/fhir/v2/0203",
              code: "MR"
            }
          ]
        },
        system: "http://hospital.example.org/patients",
        value: "12345678"
      }
    ],
    name: [
      {
        resourceType: "HumanName",
        use: "official",
        family: "García",
        given: ["Pedro"]
      }
    ],
    gender: Gender.MALE,
    birthDate: "1990-01-01",
    address: [],
    link: [],
    text: {
      status: "generated",
      div: "<div>Pedro García</div>"
    }
  };
}