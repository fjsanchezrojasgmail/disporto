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
import { Prescription } from '../../bean/models/prescription';

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

  getPrescription(): Observable<Prescription> {
    return of({
      id: 'presc-001',
      version: 1,
      revision: {
        required: true,
        code: 'REV-01',
        display: 'Revisión pendiente',
        motive: 'Falta información clínica'
      },
      idDocument: 'DOC-123456',
      approval: {
        required: true,
        code: 'APPROVED',
        display: 'Aprobada'
      },
      precautionaryBlock: {
        required: false,
        code: 'NO_BLOCK',
        display: 'Sin bloqueo'
      },
      description: 'Producto tipo A',
      status: {
        code: 'active',
        display: 'Activa'
      },
      type: {
        code: 'TYPE-A',
        display: 'Tipo A'
      },
      prescriptionDate: new Date('2024-10-10'),
      dispenseDate: new Date('2024-11-01'),
      hasValidation: true,
      observation: 'Paciente con alergias, revisar dosis.',
      productType: {
        code: 'PT-01',
        display: 'Fármaco',

      },
      productGroup: {
        code: 'PG-001',
        display: 'Grupo A',
   
      },
      service: {
        code: 'SERV-001',
        display: 'Servicio de Oncología'
      },
      prescribingCenter: {
        code: 'Center-001',
        display: 'Hospital General'
      },
      dispensingCenter: {
        code: 'Pharmacy-001',
        display: 'Farmacia Central'
      },
      actions: [
        {
          date: new Date('2024-10-15'),
          participant: {
            reference: 'Practitioner/1234',
            display: 'Dr. House'
          },
          state: {
            code: 'dispensed',
            display: 'Dispensado'
          },
          motive: 'Solicitud del médico',
          block: {
            observation: 'No se puede dispensar sin validación',
            motive: {
              code: 'BLK-01',
              display: 'Bloqueo administrativo'
            }
          },
          dispensingCenter: {
            code: 'Pharmacy-001',
            display: 'Farmacia Central'
          }
        }
      ],
      profesional: {
        
        name: 'Gregory',
        collegiateNumber: 'PROF-123',
        dni: '12345678Z',
       
      },
      payed: true,
      reimbursement: false,
      products: [
        {
          id: 'prod-001',
          request: 'req-001',
          code: '123456',
          description: 'Paracetamol 500mg comprimidos',
          type: { code: 'PT-01', display: 'Medicamento' },
          group: { code: 'PG-01', display: 'Analgésicos' },
          imf: {
            imfNoTax: 2.1,
            imfWithTax: 2.52,
            maxImf: 3,
            modifiableImf: true
          },
          units: {
            value: 2,
            originalValue: 2
          },
          pvp: {
            value: 1.5,
            valueTax: 1.81,
            tax: 21,
            total: 3.62
          },
          improvable: {
            condition: false
          },
          reimbursement: true,
          reducedVat: true,
          eyes: false,
          headset: false,
          userConsideration: {
            aportation: 0.5,
            realAportation: 0.4
          },
          pulledApart: {
            code: 'NO',
            display: 'No desglosado'
          },
          justification: 'Indicado para el dolor leve',
          observation: 'Tomar con comida',
          observations: ['No administrar a menores de 12 años']
        },
        {
          id: 'prod-002',
          request: 'req-002',
          code: '789012',
          description: 'Silla de ruedas estándar',
          type: { code: 'PT-02', display: 'Producto sanitario' },
          group: { code: 'PG-02', display: 'Movilidad' },
          imf: {
            imfNoTax: 90,
            imfWithTax: 108.9,
            maxImf: 120,
            modifiableImf: false
          },
          units: {
            value: 1,
            originalValue: 1
          },
          pvp: {
            value: 100,
            valueTax: 121,
            tax: 21,
            total: 121
          },
          improvable: {
            condition: true,
            text: 2
          },
          reimbursement: false,
          reducedVat: false,
          eyes: false,
          headset: false,
          elaboration: 'Estructura de aluminio plegable',
          brand: {
            code: 'BR-123',
            description: 'OrtoMove Pro',
            pvp: 130
          },
          userConsideration: {
            aportation: 20,
            realAportation: 18
          },
          pulledApart: {
            code: 'YES',
            display: 'Desglosado'
          },
          laterality: {
            apply: 'left',
            bodysite: 'Pierna izquierda'
          },
          justification: 'Paciente con movilidad reducida',
          observation: 'Uso doméstico',
          observations: ['No plegar con el paciente sentado'],
          consider: true,
          prescriptionBrand: true
        }
      ]
    });
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
