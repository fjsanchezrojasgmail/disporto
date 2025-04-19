import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Bundle } from '../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { HttpService } from '../http.service';
import { RequestGroupDao } from './interfaces/request-group-dao.interface';
import { RequestGroup } from '../../bean/fhir-r3/domain/interfaces/request-group.interface';
import { BundleModel } from '../../bean/fhir-r3/domain/bundle';
import { ConfigService } from '../config.service';
import { DeviceStatus, FhirTypes, RequestGroupIntent, RequestGroupPriority, RequestGroupStatus } from '../../bean/fhir-r3/fhir-constants';
import { Prescription, PrescriptionRow } from '../../bean/models/prescription';
import { FhirResourceType, PRESCRIPTION_ACTION, PrescriptionState } from '../../bean/constants';
import { FhirDeviceRequestUrl, FhirDeviceUrl, FhirRequestGroupActionUrl, FhirRequestGroupUrl } from '../../bean/fhir-r3/fhir-url-constants';
import { Device, DeviceRequest, FhirResource } from 'fhir/r3';
import { Identifier } from '../../bean/fhir-r3/domain/interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestGroupDaoService implements RequestGroupDao {

  private apiUrl = '/api/hdr/fhir/RequestGroup';

  constructor(private http: HttpService, private config: ConfigService) { }

  search(criteria: HttpParams): Observable<BundleModel | null> {
    //return this.http.get<Bundle<RequestGroup>>(this.apiUrl, { params: criteria }).pipe(map(value => (value) ? new BundleModel(value) : null));
    return of(this.mockBundleRequestGroup).pipe(map(value => new BundleModel(value)));
  }

  fetchHistoric() : Observable<Bundle<FhirResource>> {
    return of(this.mockFhirResource);
  }

  page(url: string) {
    return this.http.get<Bundle<RequestGroup>>(url).pipe(map(value => (value) ? new BundleModel(value) : null));
  }

  getPrescriptionRows(): PrescriptionRow[] {
    return [this.mapPrescriptionToRow(this.mockPrescription)];
  }

   mapPrescriptionToRow(prescription: Prescription): PrescriptionRow {
    const totalImf = prescription.products?.reduce((sum, prod) => sum + (prod.imf?.imfWithTax ?? 0), 0) ?? 0;
    const totalPVP = prescription.products?.reduce((sum, prod) => sum + (prod.pvp?.total ?? 0), 0) ?? 0;
    const totalAportation = prescription.products?.reduce((sum, prod) => sum + (prod.userConsideration?.aportation ?? 0), 0) ?? 0;

    return {
      ...prescription,
      totalImf: totalImf.toFixed(2),
      totalPVP: totalPVP.toFixed(2),
      totalAportation: totalAportation.toFixed(2),
      expanded: true,
      consider: true
    };
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
        code: PrescriptionState.PRESC_PDTE_DISPENSAR,
        display: 'Pendiente dispensar'
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

  private mockPrescription: Prescription = {
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
      code: PrescriptionState.PRESC_PDTE_DISPENSAR,
      display: 'Pendiente dispensar'
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

    }
  ,
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
  };

  private mockBundleRequestGroup: Bundle<RequestGroup> =  {
  resourceType: 'Bundle',
  type: 'searchset',
  total: 1,
  entry: [
    {
      fullUrl: 'http://example.org/fhir/RequestGroup/historic-requestgroup',
      resource: {
        resourceType: 'RequestGroup',
        meta: {
          versionId: '1',
          lastUpdated: new Date('2025-03-30T09:00:00Z'),
        },
        id: 'historic-requestgroup',
        status: RequestGroupStatus.COMPLETED,
        intent: RequestGroupIntent.PLAN,
        priority: RequestGroupPriority.ROUTINE,
        authoredOn: '2025-03-30T09:00:00Z',
        author: {
          reference: 'Practitioner/123',
          display: 'Dr. Jane Doe'
        },
        extension: [
          {
            url: FhirRequestGroupUrl.SERVICE_PROVIDER,
            valueReference: {
              reference: 'Organization/001',
              display: 'Hospital Universitario de Castilla'
            }
          },
          {
            url: FhirRequestGroupUrl.PRESCRIPTION_STATUS,
            valueCoding: {
              code: RequestGroupStatus.COMPLETED,
              display: 'Completada'
            }
          },
          {
            url:FhirRequestGroupActionUrl.DISPENSING_CENTER,
            valueCoding: {
              code: 'Pharmacy-001',
              display: 'Farmacia Central'
            }

          }
        ],
        subject: {
          reference: 'Patient/456',
          display: 'John Smith'
        },
        context: {
          reference: 'Encounter/789',
          display: 'Consulta de seguimiento'
        },
        identifier: [
          {
            system: 'http://hospital.smarthealth.org/requestgroups',
            value: 'RG-0001'
          }
        ],
        groupIdentifier: {
          system: 'http://hospital.smarthealth.org/groups',
          value: 'Group-001'
        },
        note: [
          {
            authorReference: { reference: 'Practitioner/123' },
            time: '2025-03-30T09:10:00Z',
            text: 'Plan de tratamiento actualizado según la evolución del paciente.'
          }
        ],
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
        definition: [
          {
            reference: 'PlanDefinition/diabetes-management',
            display: 'Diabetes Management Plan v2.1'
          }
        ],
        basedOn: [
          {
            reference: 'CarePlan/cp001',
            display: 'Plan de atención para diabetes'
          }
        ],
        replaces: [
          {
            reference: 'RequestGroup/old-request-001',
            display: 'Plan anterior desactualizado'
          }
        ],
        action: [

          {

            label: PRESCRIPTION_ACTION,
            description: 'Solicitar análisis de HbA1c para evaluar el control glucémico',
            type: {
              code: 'Analizador de glucosa',
              display: 'glucose-analyzer'
            },
            participant: [{
              display: '',
              identifier: {
                assigner: {
                  display: 'identifier',
                  id: 'Id-Identifier',
                  reference: 'IdentifierReference'
                },
                period: {
                  end: '05-14-2025',
                  start: '05-01-2025'
                },
                system: 'system',
                type: {
                  coding: [
                    {
                      system: 'http://loinc.org',
                      code: '4548-4',
                      display: 'Hemoglobin A1c/Hemoglobin.total in Blood'
                    }
                  ]
                },
                use: 'usual',
                value: 'value'
              },
              reference: 'Practitioner/prof-123'
            }],
            resource: {
              id: 'HbA1c',
              reference: FhirTypes.DEVICE_REQUEST,
              extension: [


                { url: FhirDeviceRequestUrl.QUANTITY, valueString: '2' },
                { url: FhirDeviceRequestUrl.QUANTITY_DISPENSED, valueString: '2' },
                { url: FhirDeviceRequestUrl.BODYSITE, valueString: 'Pancreas' },
                { url: FhirDeviceRequestUrl.JUSTIFICATION, valueCodeableConcept: { text: 'Control periódico del paciente diabético' }},
                { url: FhirDeviceRequestUrl.PRICE, valueString: '20.00' },
                { url: FhirDeviceRequestUrl.TAX_PRICE, valueString: '4.00' },
                { url: FhirDeviceRequestUrl.TAX, valueString: '21' },
                { url: FhirDeviceRequestUrl.FULL_PRICE, valueString: '24.00' },
                { url: FhirDeviceRequestUrl.REAL_APORTATION, valueString: '6.00' },
                { url: FhirDeviceRequestUrl.DISPENSED_BRAND, valueCoding: { code: 'BR123', display: 'Marca HBA1c' }},
                { url: FhirDeviceRequestUrl.IMPROVABLE, valueCodeableConcept: { coding: [{ code: 'yes' }], text: 'Puede mejorarse si no hay stock' }}
              ]
            },
            timingDateTime: new Date('2025-04-01'),
            code: [{
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '4548-4',
                  display: 'Hemoglobin A1c/Hemoglobin.total in Blood'
                }
              ]
            }],
          },
          /*
              const aportation = device?.extension?.find(e => e.url === FhirDeviceUrl.USER_CONTRIBUTION)?.valueString?.replace(',', '.');
              const amount = device?.extension?.find(e => e.url === FhirDeviceUrl.AMOUNT)?.valueString?.replace(',', '.');
              const modifiableAmount = device?.extension?.find(e => e.url === FhirDeviceUrl.MODIFIABLE_AMOUNT)?.valueString;
              const replaceable = device?.extension?.find(e => e.url === FhirDeviceUrl.REPLACEABLE)?.valueString === FhirValue.YES;
              const imf = device?.extension?.find(e => e.url === FhirDeviceUrl.IMF)?.valueCoding?.display?.replace(',', '.');
              const maxImf = device?.extension?.find(e => e.url === FhirDeviceUrl.MAXIMUM_MODIFIABLE_IMF)?.valueString?.replace(',', '.');
              const eyes = device?.extension?.find(e => e.url === FhirDeviceUrl.EYES)?.valueString === FhirValue.YES;
              const headset = device?.extension?.find(e => e.url === FhirDeviceUrl.HEADSET)?.valueString === FhirValue.YES;
              const group = device?.extension?.find(e => e.url === FhirDeviceUrl.DEVICE_GROUP)?.valueCoding;
              const brand = device?.extension?.find(e => e.url === FhirDeviceUrl.COMERCIAL_BRAND)?.valueCoding;
              const pulledApart = device?.extension?.find(e => e.url === FhirDeviceUrl.PULLED_APART)?.valueCoding;

          */

          {

            label: PRESCRIPTION_ACTION,
            description: 'Derivación para asesoría nutricional',
            resource: {
              id: 'AseNutric-1',
              reference: FhirTypes.DEVICE_REQUEST,

              extension: [
                { url: FhirDeviceUrl.REMARKS, valueString: 'Evitar contacto con humedad' },
                { url: FhirDeviceUrl.USER_CONTRIBUTION, valueString: '4.50' },
                { url: FhirDeviceUrl.AMOUNT, valueString: '19.00' },
                { url: FhirDeviceUrl.MODIFIABLE_AMOUNT, valueString: 'yes' },
                { url: FhirDeviceUrl.REPLACEABLE, valueString: 'yes' },
                { url: FhirDeviceUrl.IMF, valueCoding: { display: '21.00' }},
                { url: FhirDeviceUrl.MAXIMUM_MODIFIABLE_IMF, valueString: '25.00' },
                { url: FhirDeviceUrl.EYES, valueString: 'no' },
                { url: FhirDeviceUrl.HEADSET, valueString: 'no' },
                { url: FhirDeviceUrl.DEVICE_GROUP, valueCoding: { code: 'grp001', display: 'Analizadores' }},
                { url: FhirDeviceUrl.COMERCIAL_BRAND, valueCoding: { code: 'BR123', display: 'Marca HBA1c' }},
                { url: FhirDeviceUrl.PULLED_APART, valueCoding: { code: 'pull1', display: 'Desmontable' }}
              ]
            },
            timingDateTime: new Date('2025-05-22'),
            code: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '410942007',
                    display: 'Referral to dietitian'
                  }
                ]
              }
            ],

          }
        ]
      }
    },

  ]};

  private mockBundle: Bundle<FhirResource> = {
    resourceType: 'Bundle',
    type: 'searchset',
    total: 1,
    entry: [
      {
        fullUrl: 'http://example.org/fhir/RequestGroup/historic-requestgroup',
        resource: {
          resourceType: 'RequestGroup',
          meta: {
            versionId: '1',
            lastUpdated: '2025-03-30T09:00:00Z'
          },
          id: 'historic-requestgroup',
          status: RequestGroupStatus.COMPLETED,
          intent: RequestGroupIntent.PLAN,
          priority: RequestGroupPriority.ROUTINE,
          authoredOn: '2025-03-30T09:00:00Z',
          author: {
            reference: 'Practitioner/123',
            display: 'Dr. Jane Doe'
          },
          extension: [
            {
              url: FhirRequestGroupUrl.SERVICE_PROVIDER,
              valueReference: {
                reference: 'Organization/001',
                display: 'Hospital Universitario de Castilla'
              }
            },
            {
              url: FhirRequestGroupUrl.PRESCRIPTION_STATUS,
              valueCoding: {
                code: RequestGroupStatus.COMPLETED,
                display: 'Completada'
              }
            },
            {
              url:FhirRequestGroupActionUrl.DISPENSING_CENTER,
              valueCoding: {
                code: 'Pharmacy-001',
                display: 'Farmacia Central'
              }

            }
          ],
          subject: {
            reference: 'Patient/456',
            display: 'John Smith'
          },
          context: {
            reference: 'Encounter/789',
            display: 'Consulta de seguimiento'
          },
          identifier: [
            {
              system: 'http://hospital.smarthealth.org/requestgroups',
              value: 'RG-0001'
            }
          ],
          groupIdentifier: {
            system: 'http://hospital.smarthealth.org/groups',
            value: 'Group-001'
          },
          note: [
            {
              authorReference: { reference: 'Practitioner/123' },
              time: '2025-03-30T09:10:00Z',
              text: 'Plan de tratamiento actualizado según la evolución del paciente.'
            }
          ],
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
          definition: [
            {
              reference: 'PlanDefinition/diabetes-management',
              display: 'Diabetes Management Plan v2.1'
            }
          ],
          basedOn: [
            {
              reference: 'CarePlan/cp001',
              display: 'Plan de atención para diabetes'
            }
          ],
          replaces: [
            {
              reference: 'RequestGroup/old-request-001',
              display: 'Plan anterior desactualizado'
            }
          ],
          action: [
            {
              label: PRESCRIPTION_ACTION,
              description: 'Solicitar análisis de HbA1c para evaluar el control glucémico',
              resource: {
                reference: 'http://example.org/fhir/DeviceRequest/historic-device-request',
              },
              timingDateTime: '2025-04-01',
              code: [{
                coding: [
                  {
                    system: 'http://loinc.org',
                    code: '4548-4',
                    display: 'Hemoglobin A1c/Hemoglobin.total in Blood'
                  }
                ]
              }]
            },

            {

              label: PRESCRIPTION_ACTION,
              description: 'Derivación para asesoría nutricional',
              resource: {
                reference: 'http://example.org/fhir/Device/historic-device'
              },
              timingDateTime: '2025-05-22',
              code: [
                {
                  coding: [
                    {
                      system: 'http://snomed.info/sct',
                      code: '410942007',
                      display: 'Referral to dietitian'
                    }
                  ]
                }
              ],

            }
          ]
        }
      },
      {
        fullUrl: 'http://example.org/fhir/DeviceRequest/historic-device-request',
        resource: {
          resourceType: 'DeviceRequest',
          meta: {
            versionId: '1',
            lastUpdated: '2025-03-30T09:00:00Z'
          },
        id: 'hba1c-test',
        status: DeviceStatus.ACTIVE,
        intent: {
          coding: [{
            code: 'Ord123',
            display: 'Order 123'
          }],
          text: 'order'
        },
        subject: { reference: 'Patient/456' },
        codeReference: {
          reference: 'Device/device-hba1c'
        },
        extension: [
          {
            url: FhirDeviceRequestUrl.QUANTITY,
            valueString: '2'
          },
          {
            url: FhirDeviceRequestUrl.JUSTIFICATION,
            valueCodeableConcept: {
              text: 'Control periódico del paciente diabético'
            }
          },
          {
            url: FhirDeviceRequestUrl.PRICE,
            valueString: '20.00'
          },
          {
            url: FhirDeviceRequestUrl.TAX_PRICE,
            valueString: '4.00'
          },
          {
            url: FhirDeviceRequestUrl.TAX,
            valueString: '21'
          },
          {
            url: FhirDeviceRequestUrl.FULL_PRICE,
            valueString: '24.00'
          },
          {
            url: FhirDeviceRequestUrl.REAL_APORTATION,
            valueString: '6.00'
          },
          {
            url: FhirDeviceRequestUrl.DISPENSED_BRAND,
            valueCoding: {
              code: 'BR123',
              display: 'Marca HBA1c'
            }
          },
          {
            url: FhirDeviceRequestUrl.IMPROVABLE,
            valueCodeableConcept: {
              coding: [{ code: 'yes' }],
              text: 'Puede mejorarse si no hay stock'
            }
          }
        ]
        },
      },
      {
        fullUrl: 'http://example.org/fhir/Device/historic-device',
        resource:
        {
          resourceType: 'Device',
        id: 'device-hba1c',
        manufacturer: 'LabTech Inc.',
        model: 'HBA1C-2025',
        type: {
          text: 'Analizador de glucosa',
          coding: [{ code: 'glucose-analyzer' }]
        },
        extension: [
          {
            url: FhirDeviceUrl.REMARKS,
            valueString: 'Evitar contacto con humedad'
          },
          {
            url: FhirDeviceUrl.USER_CONTRIBUTION,
            valueString: '4.50'
          },
          {
            url: FhirDeviceUrl.AMOUNT,
            valueString: '19.00'
          },
          {
            url: FhirDeviceUrl.MODIFIABLE_AMOUNT,
            valueString: 'yes'
          },
          {
            url: FhirDeviceUrl.REPLACEABLE,
            valueString: 'yes'
          },
          {
            url: FhirDeviceUrl.IMF,
            valueCoding: {
              display: '21.00'
            }
          },
          {
            url: FhirDeviceUrl.MAXIMUM_MODIFIABLE_IMF,
            valueString: '25.00'
          },
          {
            url: FhirDeviceUrl.EYES,
            valueString: 'no'
          },
          {
            url: FhirDeviceUrl.HEADSET,
            valueString: 'no'
          },
          {
            url: FhirDeviceUrl.DEVICE_GROUP,
            valueCoding: {
              code: 'grp001',
              display: 'Analizadores'
            }
          },
          {
            url: FhirDeviceUrl.COMERCIAL_BRAND,
            valueCoding: {
              code: 'BR123',
              display: 'Marca HBA1c'
            }
          },
          {
            url: FhirDeviceUrl.PULLED_APART,
            valueCoding: {
              code: 'pull1',
              display: 'Desmontable'
            }
          }
        ]
      }

      }
    ]};

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

  private mockDeviceRequest: DeviceRequest = {
    resourceType: 'DeviceRequest',
    id: 'hba1c-test',
    status: 'active',
    intent: {
      coding: [{
        code: 'Ord123',
        display: 'Order 123'
      }],
      text: 'order'
    },
    subject: { reference: 'Patient/456' },
    codeReference: {
      reference: 'Device/device-hba1c'
    },
    extension: [
      {
        url: FhirDeviceRequestUrl.QUANTITY,
        valueString: '2'
      },
      {
        url: FhirDeviceRequestUrl.JUSTIFICATION,
        valueCodeableConcept: {
          text: 'Control periódico del paciente diabético'
        }
      },
      {
        url: FhirDeviceRequestUrl.PRICE,
        valueString: '20.00'
      },
      {
        url: FhirDeviceRequestUrl.TAX_PRICE,
        valueString: '4.00'
      },
      {
        url: FhirDeviceRequestUrl.TAX,
        valueString: '21'
      },
      {
        url: FhirDeviceRequestUrl.FULL_PRICE,
        valueString: '24.00'
      },
      {
        url: FhirDeviceRequestUrl.REAL_APORTATION,
        valueString: '6.00'
      },
      {
        url: FhirDeviceRequestUrl.DISPENSED_BRAND,
        valueCoding: {
          code: 'BR123',
          display: 'Marca HBA1c'
        }
      },
      {
        url: FhirDeviceRequestUrl.IMPROVABLE,
        valueCodeableConcept: {
          coding: [{ code: 'yes' }],
          text: 'Puede mejorarse si no hay stock'
        }
      }
    ]
  }

  private mockDevice: Device = {
    resourceType: 'Device',
    id: 'device-hba1c',
    manufacturer: 'LabTech Inc.',
    model: 'HBA1C-2025',
    type: {
      text: 'Analizador de glucosa',
      coding: [{ code: 'glucose-analyzer' }]
    },
    extension: [
      {
        url: FhirDeviceUrl.REMARKS,
        valueString: 'Evitar contacto con humedad'
      },
      {
        url: FhirDeviceUrl.USER_CONTRIBUTION,
        valueString: '4.50'
      },
      {
        url: FhirDeviceUrl.AMOUNT,
        valueString: '19.00'
      },
      {
        url: FhirDeviceUrl.MODIFIABLE_AMOUNT,
        valueString: 'yes'
      },
      {
        url: FhirDeviceUrl.REPLACEABLE,
        valueString: 'yes'
      },
      {
        url: FhirDeviceUrl.IMF,
        valueCoding: {
          display: '21.00'
        }
      },
      {
        url: FhirDeviceUrl.MAXIMUM_MODIFIABLE_IMF,
        valueString: '25.00'
      },
      {
        url: FhirDeviceUrl.EYES,
        valueString: 'no'
      },
      {
        url: FhirDeviceUrl.HEADSET,
        valueString: 'no'
      },
      {
        url: FhirDeviceUrl.DEVICE_GROUP,
        valueCoding: {
          code: 'grp001',
          display: 'Analizadores'
        }
      },
      {
        url: FhirDeviceUrl.COMERCIAL_BRAND,
        valueCoding: {
          code: 'BR123',
          display: 'Marca HBA1c'
        }
      },
      {
        url: FhirDeviceUrl.PULLED_APART,
        valueCoding: {
          code: 'pull1',
          display: 'Desmontable'
        }
      }
    ]
  }

  private mockFhirResource: Bundle<FhirResource> = {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: [
      {
        fullUrl: 'urn:uuid:request-group-001',
        resource: {
          resourceType: 'RequestGroup',
          id: 'request-group-001',
          status: RequestGroupStatus.ACTIVE,
          intent: RequestGroupIntent.PLAN,
          subject: { reference: 'Patient/456' },
          action: [
            {
              label: PRESCRIPTION_ACTION,
              description: 'Solicitud de dispositivo HBA1c',
              resource: {
                reference: 'urn:uuid:device-request-hba1c'
              }
            },
            {
              label: PRESCRIPTION_ACTION,
              description: 'Información del dispositivo HBA1c',
              resource: {
                reference: 'urn:uuid:device-hba1c'
              }
            }
          ]
        }
      },
      {
        fullUrl: 'urn:uuid:device-request-hba1c',
        resource: {
          resourceType: 'DeviceRequest',
          id: 'hba1c-test',
          status: 'active',
          intent: {
            coding: [
              {
                code: 'Ord123',
                display: 'Order 123'
              }
            ],
            text: 'order'
          },
          subject: { reference: 'Patient/456' },
          codeReference: {
            reference: 'Device/device-hba1c'
          },
          extension: [
            { url: FhirDeviceRequestUrl.QUANTITY, valueString: '2' },
            { url: FhirDeviceRequestUrl.JUSTIFICATION, valueCodeableConcept: { text: 'Control periódico del paciente diabético' }},
            { url: FhirDeviceRequestUrl.PRICE, valueString: '20.00' },
            { url: FhirDeviceRequestUrl.TAX_PRICE, valueString: '4.00' },
            { url: FhirDeviceRequestUrl.TAX, valueString: '21' },
            { url: FhirDeviceRequestUrl.FULL_PRICE, valueString: '24.00' },
            { url: FhirDeviceRequestUrl.REAL_APORTATION, valueString: '6.00' },
            { url: FhirDeviceRequestUrl.DISPENSED_BRAND, valueCoding: { code: 'BR123', display: 'Marca HBA1c' }},
            { url: FhirDeviceRequestUrl.IMPROVABLE, valueCodeableConcept: { coding: [{ code: 'yes' }], text: 'Puede mejorarse si no hay stock' }}
          ]
        }
      },
      {
        fullUrl: 'urn:uuid:device-hba1c',
        resource: {
          resourceType: 'Device',
          id: 'device-hba1c',
          manufacturer: 'LabTech Inc.',
          model: 'HBA1C-2025',
          type: {
            text: 'Analizador de glucosa',
            coding: [{ code: 'glucose-analyzer' }]
          },
          extension: [
            { url: FhirDeviceUrl.REMARKS, valueString: 'Evitar contacto con humedad' },
            { url: FhirDeviceUrl.USER_CONTRIBUTION, valueString: '4.50' },
            { url: FhirDeviceUrl.AMOUNT, valueString: '19.00' },
            { url: FhirDeviceUrl.MODIFIABLE_AMOUNT, valueString: 'yes' },
            { url: FhirDeviceUrl.REPLACEABLE, valueString: 'yes' },
            { url: FhirDeviceUrl.IMF, valueCoding: { display: '21.00' }},
            { url: FhirDeviceUrl.MAXIMUM_MODIFIABLE_IMF, valueString: '25.00' },
            { url: FhirDeviceUrl.EYES, valueString: 'no' },
            { url: FhirDeviceUrl.HEADSET, valueString: 'no' },
            { url: FhirDeviceUrl.DEVICE_GROUP, valueCoding: { code: 'grp001', display: 'Analizadores' }},
            { url: FhirDeviceUrl.COMERCIAL_BRAND, valueCoding: { code: 'BR123', display: 'Marca HBA1c' }},
            { url: FhirDeviceUrl.PULLED_APART, valueCoding: { code: 'pull1', display: 'Desmontable' }}
          ]
        }
      }
    ]
  };

}
