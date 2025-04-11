import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { versionBundleCriteria } from '../../bean/fhir-r3/criterias/fhir-criterias';
import { BundleModel } from '../../bean/fhir-r3/domain/bundle';
import { Bundle, BundleEntry } from '../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { FhirResource } from '../../bean/fhir-r3/domain/interfaces/common.interface';
import { DeviceRequestStatus, DeviceStatus, FhirTypes, RequestGroupIntent, RequestGroupPriority, RequestGroupStatus } from '../../bean/fhir-r3/fhir-constants';
import { HttpService } from '../http.service';
import { BundleDao } from './interfaces/bundle-dao.interface';
import { Prescription } from '../../bean/models/prescription';
import { MedicationRequest } from 'fhir/r3';
import { FhirDeviceRequestUrl, FhirDeviceUrl, FhirRequestGroupActionUrl, FhirRequestGroupUrl } from '../../bean/fhir-r3/fhir-url-constants';
import { FhirResourceType, PRESCRIPTION_ACTION } from '../../bean/constants';



@Injectable({
  providedIn: 'root'
})
export class BundleDaoService implements BundleDao {

  private apiUrl = '/api/hdr/fhir/Bundle';

  constructor(private http: HttpService) { }

  //Special call to update bundle entries, update via post
  updateResource(data: BundleEntry<FhirResource>[]): Observable<Bundle<FhirResource> | null> {
    const body: Bundle<FhirResource> = {
      entry: data?.map(e => <BundleEntry<FhirResource>>{
        fullUrl: `${e.resource?.resourceType}/${e.resource?.id}`,
        request: { method: 'PUT', url: `${e.resource?.resourceType}/${e.resource?.id}` },
        resource: e.resource
      }), resourceType: FhirTypes.BUNDLE, total: data?.length, type: 'transaction'
    };
    return this.http.post<Bundle<FhirResource>, Bundle<FhirResource>>('/api/hdr/fhir', body);
  }

  update(request: string, bundle: BundleModel) {
    this.getByIdentifier(request).subscribe(
      data => {
        if (data) {
          const modData = data.entry?.at(0)?.resource as Bundle<FhirResource>;
          const entries = bundle.getEntriesByEntries(modData.entry);
          modData.entry = entries;
          if (entries.length > 0 && modData.id) {
            this.http.put<Bundle<Bundle<FhirResource>>, Bundle<FhirResource>>(this.apiUrl + '/' + modData.id, modData).subscribe();
          }
        }
      }
    );
  }

  getByIdentifier(id: string): Observable<Bundle<Bundle> | null> {
    return this.http.get<Bundle<Bundle>>(this.apiUrl, { params: versionBundleCriteria(id) });
  }

  getHistory(bundleId: string): Observable<Bundle<Bundle> | null> {
    return this.http.get<Bundle<Bundle>>(`${this.apiUrl}/${bundleId}/_history`);

  }

  getVersion(bundleId: string, version: number): Observable<Bundle<Bundle> | null> {
    return this.http.get<Bundle<Bundle>>(`${this.apiUrl}/${bundleId}/_history/${version}`);
  }

  private mockBundle: Bundle<FhirResource> = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: 1,
      entry: [
        {
          fullUrl: 'http://example.org/fhir/RequestGroup/historic-requestgroup',
          resource: {
            resourceType: FhirTypes.REQUEST_GROUP,
            meta: {
              versionId: '1',
              lastUpdated: new Date('2025-03-30T09:00:00Z')
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
                timingDateTime: new Date('2025-04-01'),
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
            resourceType: FhirTypes.DEVICE_REQUEST,
            meta: {
              versionId: '1',
              lastUpdated: new Date('2025-03-30T09:00:00Z')
            },
          id: 'hba1c-test',
          status: DeviceRequestStatus.ACTIVE,
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
            resourceType: FhirTypes.DEVICE,
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

}
