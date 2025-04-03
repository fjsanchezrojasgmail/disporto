import { PrescriptionState, PRESCRIPTION_ACTION } from '../constants';
import { Reference } from '../fhir-r3/domain/interfaces/common.interface';
import { Observation } from '../fhir-r3/domain/interfaces/observation';
import { Organization } from '../fhir-r3/domain/interfaces/organization.interface';
import { RequestGroup } from '../fhir-r3/domain/interfaces/request-group.interface';
import { FhirTypes, FhirValue } from '../fhir-r3/fhir-constants';
import { FhirContained, FhirIdentifierSystem, FhirRequestGroupActionUrl, FhirRequestGroupUrl } from '../fhir-r3/fhir-url-constants';
import { BlockMotive, DisplayItem, SecureDisplayItem } from '../simple.types';
import { Product } from './product';
import { SimpleProfesional } from './profesional';

export interface Prescription {
  id: string;
  description: string;
  status: PrescriptionStatus;
  type: PrescriptionType;
  productType: DisplayItem;
  productGroup: DisplayItem;
  products: Product[];
  version: number;
  service?: DisplayItem;
  prescribingCenter?: DisplayItem;
  dispensingCenter?: DisplayItem;
  payed?: boolean;
  reimbursement?: boolean;
  revision?: RevisionRequired;
  approval?: ApprovalRequired;
  precautionaryBlock?: BlockStatus;
  observation?: string;
  hasValidation?: boolean;
  prescriptionDate?: Date;
  dispenseDate?: Date;
  profesional?: SimpleProfesional;
  actions?: PrescriptionAction[];
  idDocument?: string;
}




export interface PrescriptionRow extends Prescription {
  totalImf: string;
  totalPVP: string;
  totalAportation: string;
  expanded: boolean;
  consider: boolean;
}
export interface BillingDispensation extends Prescription {
  totalPvp?: number;
  totalAportation?: number;
  totalPvpTax?: number;
  totalDiff?: number;
  check?: boolean;
}

export interface PrescriptionBilling extends Prescription {
  check: boolean,
}

export interface PrescriptionVersioned extends Prescription {
  //action?: PrescriptionAction;
  updateDate?: Date;
  bundleVersion?: string;
}

export type PrescriptionAction = {
  state: PrescriptionStatus;
  participant: Reference;
  date: Date;
  dispensingCenter?: DisplayItem;
  block?: BlockDefinition;
  motive?: string;
}

export type PrescriptionStatus = SecureDisplayItem;

export type PrescriptionType = SecureDisplayItem;

export type BlockDefinition = {
  motive: BlockMotive,
  observation?: string,
}

export type ApprovalRequired = {
  required: boolean;
  code?: string,
  display?: string,
}

export type BlockStatus = ApprovalRequired;
export type RevisionRequired = {
  required: boolean;
  code?: string,
  display?: string,
  motive?: string,
};

export const mapFhirToPrescription = (
  req: RequestGroup, products: Product[],
  profesional: SimpleProfesional | undefined,
  center: Organization | undefined, reasonRejected?: string): Prescription => {

  const idDocument = req.extension?.find(e => e.url === FhirRequestGroupUrl.ID_DOCUMENT_CUSTODY)?.valueString;
  const status = req.extension?.find(e => e.url === FhirRequestGroupUrl.PRESCRIPTION_STATUS)?.valueCoding;
  const type = req.extension?.find(e => e.url === FhirRequestGroupUrl.PRESCRIPTION_TYPE)?.valueCodeableConcept?.coding?.at(0);
  const approval = req.extension?.find(e => e.url === FhirRequestGroupUrl.REQUIRES_APPROVAL)?.valueCodeableConcept;
  const revision = req.extension?.find(e => e.url === FhirRequestGroupUrl.VALIDATION_REQUIRED)?.valueCodeableConcept;
  const prescriptionDate = req.authoredOn; //extension?.find( e => e.url === FhirRequestGroupUrl.VALIDITY_DATE)?.valueDate;
  const dispensingCenter = req.extension?.find(e => e.url === FhirRequestGroupUrl.DISPENSING_CENTER)?.valueCoding;
  const dispensationDate = req.extension?.find(e => e.url === FhirRequestGroupUrl.DISPENSATION_DATE)?.valueDate;
  const precautionaryBlock = req.extension?.find(e => e.url === FhirRequestGroupUrl.PRECAUTIONARY_BLOCKING)?.valueCodeableConcept;
  const payed = req.extension?.find(e => e.url === FhirRequestGroupUrl.PAYED)?.valueString === FhirValue.YES;
  const reimbursement = req.extension?.find(e => e.url === FhirRequestGroupUrl.PARECYL_BILLING)?.valueString === FhirValue.YES;
  const actions = req.action?.filter(a => a.label === PRESCRIPTION_ACTION).reverse().map(a => {
    const block = a.extension?.find(e => e.url === FhirRequestGroupActionUrl.BLOCK)?.valueCodeableConcept;
    const refusal = a.extension?.find(e => e.url === FhirRequestGroupActionUrl.OBSERVATIONS)?.valueString;
    const motive = a.extension?.find(e => e.url === FhirRequestGroupActionUrl.MOTIVE)?.valueString;
    const center = a.extension?.find(e => e.url === FhirRequestGroupActionUrl.DISPENSING_CENTER)?.valueCoding;
    return <PrescriptionAction>{
      date: new Date(a.timingDateTime || ''),
      participant: a.participant?.find(p => p.reference?.includes(FhirTypes.PRACTITIONER)),
      state: {
        code: a.code?.at(0)?.coding?.at(0)?.code,
        display: a.code?.at(0)?.coding?.at(0)?.display
      },
      motive,
      block: {
        observation: block?.text || refusal,
        motive: {
          code: block?.coding?.at(0)?.code,
          display: block?.coding?.at(0)?.display
        }
      },
      dispensingCenter: center ? { code: center.code, display: center.display } : undefined
    };
  });
  const model: Prescription = {
    id: req.id || '',
    version: Number(req.meta?.versionId || '1'),
    revision: {
      required: revision?.text === FhirValue.YES,
      code: revision?.coding?.at(0)?.code,
      display: revision?.coding?.at(0)?.display,
      motive: reasonRejected
    },
    idDocument,
    approval: {
      required: approval?.text === FhirValue.YES,
      code: approval?.coding?.at(0)?.code,
      display: approval?.coding?.at(0)?.display
    },
    precautionaryBlock: {
      required: precautionaryBlock?.text === FhirValue.YES,
      code: precautionaryBlock?.coding?.at(0)?.code,
      display: precautionaryBlock?.coding?.at(0)?.display
    },
    description: req.identifier?.find(i => i.system === FhirIdentifierSystem.PRODUCT_TYPE)?.type?.text || '',
    status: {
      code: status?.code || '',
      display: status?.display || ''
    },
    type: {
      code: type?.code || '',
      display: type?.display || ''
    },
    prescriptionDate: (prescriptionDate) ? new Date(prescriptionDate) : undefined,
    dispenseDate: (dispensationDate) ? new Date(dispensationDate) : undefined,
    hasValidation: req.action?.find(a => a.code?.at(0)?.coding?.at(0)?.code === PrescriptionState.PRESC_PDTE_VALIDACION) !== undefined,
    observation: (req.contained?.find(c => c.id === FhirContained.OBSERVATION) as Observation)?.valueString,
    productType: {
      ...products.at(0)?.type
    },
    productGroup: {
      ...products.at(0)?.group
    },
    service: {
      code: center?.id,
      display: center?.name
    },
    prescribingCenter: {
      code: center?.partOf?.reference,
      display: center?.partOf?.display
    },
    dispensingCenter: { code: dispensingCenter?.code, display: dispensingCenter?.display },
    actions,
    profesional,
    payed,
    reimbursement,
    products
  };
  return model;
};

export const mapPrescriptions = (prescriptions: Prescription[] | PrescriptionRow[]) => {
  const result: PrescriptionRow[] = prescriptions.map(presc => {
    const expanded = ('expanded' in presc) ? presc.expanded : presc.products.length > 1;
    const consider = ('consider' in presc) ? presc.consider : false;
    let sumImf = 0;
    let sumPVP = 0;
    let sumAportation = 0;
    presc.products.filter(p => p.consider).map(p => {
      sumImf += Number(p.imf || '0');
      sumPVP += p.pvp?.value || 0;
      sumAportation += p.userConsideration.realAportation || 0;
      //p.pvp.total = (p.units.value) * (p.pvp.valueTax || 0);
    });
    return <PrescriptionRow>{
      ...presc,
      expanded: expanded,
      consider: consider,
      totalImf: sumImf.toFixed(2),
      totalPVP: sumPVP.toFixed(2),
      totalAportation: sumAportation.toFixed(2)
    };
  });
  return result;
};