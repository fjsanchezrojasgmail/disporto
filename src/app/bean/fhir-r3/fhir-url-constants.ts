
export type FhirUrlExtensions = FhirPatienUrl | FhirRequestGroupUrl | FhirDeviceUrl | FhirDeviceRequestUrl;

export enum FhirRequestGroupUrl {
    PRESCRIPTION_TYPE = 'http://es.indra.hnanexo.prescriptionType',
    VALIDITY_DATE = 'http://es.indra.hnanexo.validityDate',
    MAX_ACTIVE_DATE = 'http://es.indra.hnanexo.maxActiveDate',
    PRESCRIPTION_STATUS = 'http://es.indra.hnanexo.prescriptionStatus',
    FINANCIAL_CONDITIONS = 'es.indra.hnanexo.financialConditions',
    REF_CONDITION = 'http://es.indra.hnanexo.refCondition',
    SERVICE_PROVIDER = 'http://es.indra.hnanexo.serviceProvider',
    CLAIM_REQUEST = 'http://es.indra.hnanexo.claimRequest',
    VALIDATION_REQUIRED = 'http://es.indra.hnanexo.validationRequired',
    REQUIRES_APPROVAL = 'http://es.indra.hnanexo.requiresApproval',
    EXPENSE_REIMBURSEMENT = 'http://es.indra.hnanexo.expenseReimbursement',
    DISPENSATION_DATE = 'http://es.indra.hnanexo.dispensationDate',
    PRECAUTIONARY_BLOCKING = 'http://es.indra.hnanexo.precautionaryBlocking',
    DISPENSING_CENTER = 'http://es.indra.hnanexo.dispensingCenter',
    PAYED = 'http://es.indra.hnanexo.payed',
    PARECYL_BILLING = 'http://es.indra.hnanexo.parecylBilling',
    ESTABLISHMENT_BILLING = 'http://es.indra.hnanexo.establishmentBilling',
    ID_DOCUMENT_CUSTODY = 'http://es.indra.hnanexo.idCustodyDoc'
}

export enum FhirPatienUrl {
    NATIONALITY = 'http://hl7.org/fhir/StructureDefinition/patient-nationality',
    BIRTHCOUNTRY = 'http://hn.indra.es/fhir/StructureDefinition/patient-birthcountry',
    BASIC_HEALTH_AREA = 'http://hn.indra.es/fhir/StructureDefinition/basic-health-area',
    PHARMACY_INDICATOR = 'http://hn.indra.es/fhir/StructureDefinition/pharmacy_indicator',
    SITUATION = 'http://hn.indra.es/fhir/StructureDefinition/patient_situation',
    GUARDIAN_IDENTIFIER = 'http://hn.indra.es/fhir/StructureDefinition/identifier-guardian',
    DISABILITY = 'http://hn.indra.es/fhir/StructureDefinition/patient_disability',
}

export enum FhirDeviceUrl {
    REQUIRES_VALIDATION = 'http://es.indra.hnanexo.requiresvalidation',
    DEVICE_GROUP = 'http://es.indra.hnanexo.deviceGroup',
    DEVICE_SUBGROUP = 'http://es.indra.hnanexo.deviceSubgroup',
    GROUP = 'http://es.indra.hnanexo.group',
    SUBGROUP = 'http://es.indra.hnanexo.subgroup',
    REQUIREVALIDATION = 'http://es.indra.hnanexo.requiresvalidation',
    DESCRIPTION = 'http://hnanexo/descriptiondevice',
    INDICATIONS = 'http://hnanexo/indications',
    PRESCSERVICE = 'http://es.indra.hnanexo.prescriberservice',
    IMF = 'http://es.indra.hnanexo.imf',
    LATERALITY = 'http://es.indra.hnanexo.laterality',
    PHOTO = 'http://es.indra.hnanexo.imageProduct',
    TYPEUDS = 'http://es.indra.hnanexo.typeuds',
    PRESCRIBER_CHECK = 'http://es.indra.hnanexo.prescriberCheck',
    REMARKS = 'http://es.indra.hnanexo.remarks',
    REPLACEABLE = 'http://es.indra.hnanexo.replaceable',
    SPECIAL_PRESCRIPTION = 'http://es.indra.hnanexo.specialPrescription',
    INSPECTOR_APPROVAL = 'http://es.indra.hnanexo.inspectorApproval',
    AMOUNT = 'http://es.indra.hnanexo.amount',
    REDUCED_VAT = 'http://es.indra.hnanexo.reducedVat',
    MODIFIABLE_AMOUNT = 'http://es.indra.hnanexo.modifiableAmount',
    MAXIMUM_MODIFIABLE_IMF = 'http://es.indra.hnanexo.maximumModifiableIMF',
    USER_CONTRIBUTION = 'http://es.indra.hnanexo.userContribution',
    NUMBER_UNITS = 'http://es.indra.hnanexo.numberUnits',
    EXPENSE_REIMBURSEMENT = 'http://es.indra.hnanexo.expenseReimbursement',
    RECOVERABLE = 'http://es.indra.hnanexo.recoverable',
    EYES = 'http://es.indra.hnanexo.eyes',
    HEADSET = 'http://es.indra.hnanexo.headset',
    ASSIGNED_SERVICE = 'http://es.indra.hnanexo.assignedService',
    COMERCIAL_BRAND = 'http://es.indra.hnanexo.comercialBrand',
    TYPE_ELABORATION = 'http://es.indra.hnanexo.typeElaboration',
    PULLED_APART = 'http://es.indra.hnanexo.pulledApart',
}

export enum FhirRequestGroupActionUrl {
    BLOCK = 'http://es.indra.hnanexo.block',
    MOTIVE = 'es.indra.hnanexo.motive',
    OBSERVATIONS = 'es.indra.hnanexo.observations',
    DISPENSING_CENTER = 'http://es.indra.hnanexo.dispensingCenter',
    VERSION = 'http://es.indra.hnanexo.version',
}

export enum FhirDeviceRequestUrl {
    QUANTITY = 'http://es.indra.hnanexo.quantity',
    QUANTITY_DISPENSED = 'http://es.indra.hnanexo.quantityDispensed',
    BODYSITE = 'http://es.indra.hnanexo.bodysite',
    JUSTIFICATION = 'http://es.indra.hnanexo.justification',
    PRICE = 'http://es.indra.hnanexo.price',
    TAX_PRICE = 'http://es.indra.hnanexo.taxPrice',
    TAX = 'http://es.indra.hnanexo.tax',
    FULL_PRICE = 'http://es.indra.hnanexo.fullPrice',
    REAL_APORTATION = 'http://es.indra.hnanexo.realAportation',
    DISPENSED_BRAND = 'http://es.indra.hnanexo.dispensedBrand',
    IMPROVABLE = 'http://es.indra.hnanexo.improvable',
}

export enum FhirIdentifierSystem {
    NNESP = 'NNESP',
    DNI = 'DNI',
    COLLEGIATE_NUMBER = 'NUM_COLEGIADO',
    CIPA = 'CIPAUTONOMICO',
    ATLANTIX_NUMBER = 'es.indra.hnanexo.atlantixNumber',
    PRODUCT_TYPE = 'es.indra.hnanexo.productType',
}

export enum FhirContained {
    OBSERVATION = 'orthopedicsObs',
    REASON_REJECTED = 'reasonRejected',
}

export enum FhirDefaultUrl {
    CODE = 'code'
}