import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, switchMap } from 'rxjs';
import { BundleModel } from '../../../bean/fhir-r3/domain/bundle';
import { Bundle } from '../../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { SimplePatient } from '../../../bean/models/patient';
import { PrescriptionAction, PrescriptionVersioned } from '../../../bean/models/prescription';

import { GlobalFeedbackService } from '../../global-feedback.service';
import { BundleDaoService } from '../../dao/bundle-dao.service';
import { Product } from '../../../bean/models/product';

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

  private mockPrescriptionVersioned: PrescriptionVersioned = {
    id: 'rx-0001',
    description: 'Prescripción de Paracetamol y Silla de ruedas',
    status: {
      code: 'active',
      display: 'Activa'
    },
    type: {
      code: 'standard',
      display: 'Prescripción estándar'
    },
    productType: {
      code: 'PT-01',
      display: 'Medicamento'
    },
    productGroup: {
      code: 'PG-01',
      display: 'Analgésicos'
    },
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
    
      
    
    ],
    version: 2,
    service: {
      code: 'SERV-001',
      display: 'Medicina General'
    },
    prescribingCenter: {
      code: 'CENT-001',
      display: 'Centro de Salud Norte'
    },
    dispensingCenter: {
      code: 'CENT-002',
      display: 'Farmacia Barrio Sur'
    },
    payed: true,
    reimbursement: false,
    revision: {
      required: false,
      code: 'rev-0',
      display: 'Sin revisión'
    },
    approval: {
      required: true,
      code: 'appr-1',
      display: 'Requiere aprobación'
    },
    precautionaryBlock: {
      required: false,
      code: 'no-block',
      display: 'Sin bloqueo'
    },
    observation: 'Paciente con alergia al ibuprofeno',
    hasValidation: true,
    prescriptionDate: new Date('2025-03-15'),
    dispenseDate: new Date('2025-03-20'),
    profesional: {
      name: 'María López González',
      dni: '11111111A',
      collegiateNumber: 'COL-45678'
    },
    actions: [
      {
        date: new Date('2025-03-16'),
        state: {
          code: 'dispensado',
          display: 'Producto dispensado'
        },
        participant: {
          reference: 'Practitioner/prof-123'
        },
        motive: 'Solicitud inicial',
        block: {
          observation: 'Sin incidencias',
          motive: {
            code: 'none',
            display: 'Ninguna'
          }
        },
        dispensingCenter: {
          code: 'CENT-002',
          display: 'Farmacia Barrio Sur'
        }
      }
    ],
    idDocument: 'DOC-0001',
    updateDate: new Date('2025-03-27T10:15:00'),
    bundleVersion: '3'
  };

  private mockProduct1: Product = {
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
  };
  private mockProduct2: Product = {
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

}
