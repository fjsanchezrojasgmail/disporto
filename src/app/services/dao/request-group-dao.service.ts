import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Bundle } from '../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { HttpService } from '../http.service';
import { RequestGroupDao } from './interfaces/request-group-dao.interface';
import { RequestGroup } from '../../bean/fhir-r3/domain/interfaces/request-group.interface';
import { BundleModel } from '../../bean/fhir-r3/domain/bundle';
import { ConfigService } from '../config.service';
import { RequestGroupIntent, RequestGroupPriority, RequestGroupStatus } from '../../bean/fhir-r3/fhir-constants';

@Injectable({
  providedIn: 'root'
})
export class RequestGroupDaoService implements RequestGroupDao {

  private apiUrl = '/api/hdr/fhir/RequestGroup';

  constructor(private http: HttpService, private config: ConfigService) { }

  search(criteria: HttpParams): Observable<BundleModel | null> {
    //return this.http.get<Bundle<RequestGroup>>(this.apiUrl, { params: criteria }).pipe(map(value => (value) ? new BundleModel(value) : null));
    return of(this.mockBundle).pipe(map(value => new BundleModel(value)))
  }

  page(url: string) {
    return this.http.get<Bundle<RequestGroup>>(url).pipe(map(value => (value) ? new BundleModel(value) : null));
  }

  private mockBundle: Bundle<RequestGroup> = {
    resourceType: 'Bundle',
    type: 'searchset',
    total: 1,
    entry: [
      {
        fullUrl: 'http://example.org/fhir/RequestGroup/example-requestgroup',
        resource: {
          resourceType: 'RequestGroup',
          id: 'example-requestgroup',
          "status": RequestGroupStatus.ACTIVE,
          "intent": RequestGroupIntent.PLAN,
          "priority": RequestGroupPriority.ROUTINE,
          authoredOn: '2025-03-28T09:00:00Z',
          author: { reference: 'Practitioner/123', display: 'Dr. Jane Doe' },
          subject: { reference: 'Patient/456', display: 'John Smith' },
          context: { reference: 'Encounter/789' },
          identifier: [
            { system: 'http://hospital.smarthealth.org/requestgroups', value: 'RG-0001' }
          ],
          groupIdentifier: {
            system: 'http://hospital.smarthealth.org/groups',
            value: 'Group-001'
          },
          note: [{ text: 'Group of requests for diabetic care plan' }],
          reasonCodeableConcept: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '44054006',
                display: 'Diabetes mellitus type 2'
              }
            ],
            text: 'Type 2 diabetes management'
          },
          definition: [{ reference: 'PlanDefinition/diabetes-management' }],
          basedOn: [{ reference: 'CarePlan/cp001' }],
          replaces: [{ reference: 'RequestGroup/old-request-001' }],
          action: [
            {

              description: 'Check HbA1c level in blood',
              resource: { reference: 'DiagnosticRequest/hba1c-test' }
            },
            {

              description: 'Referral for nutrition counseling',
              resource: { reference: 'ReferralRequest/dietician-referral' }
            }
          ]
        }
      }
    ]
  };

  private mockRequestGroup : RequestGroup = {

    "resourceType": "RequestGroup",
    "id": "example-requestgroup",
    "status": RequestGroupStatus.ACTIVE,
    "intent": RequestGroupIntent.PLAN,
    "priority": RequestGroupPriority.ROUTINE,
    "authoredOn": "2025-03-28T09:00:00Z",
    "author": {
      "reference": "Practitioner/123",
      "display": "Dr. Jane Doe"
    },
    "subject": {
      "reference": "Patient/456",
      "display": "John Smith"
    },
    "context": {
      "reference": "Encounter/789"
    },
    "identifier": [
      {
        "system": "http://hospital.smarthealth.org/requestgroups",
        "value": "RG-0001"
      }
    ],
    "groupIdentifier": {
      "system": "http://hospital.smarthealth.org/groups",
      "value": "Group-001"
    },
    "note": [
      {
        "text": "Group of requests for diabetic care plan"
      }
    ],
    "reasonCodeableConcept": {
      "coding": [
        {
          "system": "http://snomed.info/sct",
          "code": "44054006",
          "display": "Diabetes mellitus type 2"
        }
      ],
      "text": "Type 2 diabetes management"
    },
    "definition": [
      {
        "reference": "PlanDefinition/diabetes-management"
      }
    ],
    "basedOn": [
      {
        "reference": "CarePlan/cp001"
      }
    ],
    "replaces": [
      {
        "reference": "RequestGroup/old-request-001"
      }
    ],
    "action": [
      {
        "description": "Check HbA1c level in blood",
        "resource": {
          "reference": "DiagnosticRequest/hba1c-test"
        }
      },
      {
        "description": "Referral for nutrition counseling",
        "resource": {
          "reference": "ReferralRequest/dietician-referral"
        }
      }
    ]
  }
}
