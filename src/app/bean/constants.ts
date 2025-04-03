export enum Laterality {
    RIGHT = '1',
    LEFT = '2',
    BOTH = '3',
    APPLY = 'S',
    NOT_APPLY = 'N'
}

export enum PrescriptionActions {
    DISPENSE = 'dispense',
    RESERVE = 'reserve',
    BLOCK = 'block',
    COMMUNICATE = 'communicate',
    SET_BRAND = 'brand',
    DETAILS = 'detail',
    MODIFY = 'modify',
}

export enum AdminActions {
    DETAILS = 'detail',
    MODIFY = 'modify',
}

export enum Modes {
    CREATE,
    MODIFY,
    CONSULT
}

export enum BillingActions {
    GENERATE_CLOSING,
    ACCEPT_ESTABLISHMENT_BILLING,
    ACCEPT_PROVINCIAL_BILLING,
    ASSOCIATE_REGULARIZATIONS,
    CONSULT_REGULARIZATIONS,
    CONFIRM_BILLING,
    BILLING_CLOSING_ASSOCIATION,
    BILLING_CLOSING_ESTABLISHMENT,
    PRINT_INDIVIDUAL_BILLING,
    PRINT_PROVINCIAL_BILLING,
    PRINT_GENERAL_BILLING,
}

export enum PrescriptionState {
    PRESC_PDTE_VALIDACION = 'PRESCPDTEVALIDACION', //filtro hist
    PRESC_PDTE_NUEVAVALIDACION = 'PRESCPDTENUEVAVALIDACION',//filtro hist
    ANULADA = 'ANULADA',//filtro hist
    PRESC_PDTE_DISPENSAR = 'PRESCPDTEDISPENSAR',//filtro hist
    PRESC_PDTE_VISTO_BUENO = 'PRESCPDTEVISTOBUENO',//filtro hist
    PRESC_NO_SACYL = 'PRESCNOSACYL',//filtro hist
    PRESC_ACEPTADO_VISTO_BUENO = 'PRESCACEPTADOVISTOBUENO',
    PRESC_DENEGADO_VISTO_BUENO = 'PRESCDENEGADOVISTOBUENO',//filtro hist
    PRESC_RESERVADA = 'PRESCRESERVADA',//filtro hist
    PRESC_DISPENSADA = 'PRESCDISPENSADA',//filtro hist
    PRESC_BLOQUEO_CAUTELAR = 'PRESCBLOQUEOCAUTELAR',//filtro hist
    ANULADA_BLOQUEO_CAUTELAR = 'ANULADABLOQUEOCAUTELAR',//filtro hist
    BLOQUEO_CAUTELAR_NO_ADMITIDO = 'BLOQUEOCAUTELARNOADMITIDO',
    BLOQUEO_CAUTELAR_ADMITIDO = 'BLOQUEOCAUTELARADMITIDO',
    VISTOBUENOADMITIDO = 'VISTOBUENOADMITIDO',
    VISTOBUENONOADMITIDO = 'VISTOBUENONOADMITIDO',
}

export const prescriptionDisplay: Record<PrescriptionState, string> = {
    'PRESCPDTEVALIDACION': 'PDTE PRIMERA REVISIÓN',
    'PRESCPDTENUEVAVALIDACION': 'PDTE NUEVA REVISIÓN',
    'ANULADA': 'ANULADA',
    'PRESCPDTEDISPENSAR': 'PDTE DISPENSAR',
    'PRESCPDTEVISTOBUENO': 'PDTE VISTO BUENO',
    'PRESCNOSACYL': 'NO SACYL',
    'PRESCACEPTADOVISTOBUENO': 'ACEPTADO VISTO BUENO',
    'PRESCDENEGADOVISTOBUENO': 'ANULADA VISTO BUENO',
    'PRESCRESERVADA': 'RESERVADA',
    'PRESCDISPENSADA': 'DISPENSADA',
    'PRESCBLOQUEOCAUTELAR': 'BLOQUEADA CAUTELARMENTE',
    'ANULADABLOQUEOCAUTELAR': 'ANULADA POR BLOQUEO CAUTELAR',
    'BLOQUEOCAUTELARNOADMITIDO': 'BLOQUEO CAUTELAR NO ADMITIDO',
    'BLOQUEOCAUTELARADMITIDO': 'BLOQUEO CAUTELAR ADMITIDO',
    'VISTOBUENOADMITIDO': 'VISTO BUENO ADMITIDO',
    'VISTOBUENONOADMITIDO': 'VISTO BUENO NO ADMITIDO'
};

export const PRESCRIPTION_ACTION = 'ACTION';

export const ActivePasive: Record<string, string> = {

    '0': 'Activo',
    '1': 'Pasivo'

};


export const cautelarBlockDisplay: Record<CautelarBlockCodes, string> = {
    '1': 'Pendiente',
    '3': 'Admitido',
    '4': 'No Admitido'
};


export enum ApprovalCodes {
    PENDING = '1',
    ACCEPTED = '3',
    DENIED = '4'
}

export enum RevisionCodes {
    PENDING = '1',
    PENDING_NEW_REVISION = '2',
    APPROVED = '3',
    DENIED = '4'
}

export enum CautelarBlockCodes {
    PENDING = '1',
    ADMITTED = '3',
    NOT_ADMITTED = '4'
}

export enum EstablishmentBillingTypes {
    ASSOCIATION = '1',
    SCHOOL = '2',
    INDEPENDENT = '3'
}

export enum ProfesionalTypes {
    DISPENSER_ESTABLISHMENT = '1',
    ASSOCIATION = '2',
    PROVINCIAL_COLLEGE = '3',
    CONCYL = '4',
    AREA_MANAGEMENT = '5',
    SSCC_MANAGEMENT = '6',
    SUPER_ADMIN = '10',
}

export enum PatientSituation {
    USUAL = 'H',
    DISPLACED_INSIDE = 'S',
    DISPLACED_OUTSIDE = 'D',
    PASSER_BY = 'T'
}


export enum ConstantKeys {
    T_HISTORICAL = 'T_HISTORICO',
    T_MAX_HISTORICAL = 'T_HISTORICO_MAXIMO',
    MOD_DISPENSATION = 'MODIF_DISPENSACION',
    MOD_RESERVE = 'MODIF_RESERVA',
    MOD_PRECAUTIONARY_BLOCK = 'MODIF_BLOQUEO_CAUTELAR',
    PORC_DISCAPACIDAD = 'PORC_DISCAPACIDAD',
    MAX_VALIDITY_DATE = 'FECHA_MAX_VIGENCIA',
    MAX_VALIDITY_DATE_SUP = 'FECHA_VIGENCIA_SUP',
    MAX_DISPENSATION_DATE = 'FECHA_MAX_DISPENSA',
    MAX_REFUND_DATE = 'FECHA_MAX_REEMB',
    MAX_PRODUCTION_LIFE = 'MAX_VIDA_ELAB',
    COMMERCIAL_BRAND = 'MARCA_COMERCIAL',
}

export const MaxPageSize = 10;

export const PatientPharmacy = 'TSI 001';

export enum PrescriptionTypes {
    REC = 'REC',
    REP = 'REP',
}

export enum RegularisationStates {
    PENDING = '1',
    ASSOCIATED = '2',
}

export const RegularisationStatesDescription: Record<RegularisationStates, string> = {
    '1': 'label.pending',
    '2': 'label.associated'
};

export enum AdminStatus {
    ACTIVE = 'label.active',
    PASIVE = 'label.pasive'
}

export const undefinedStringToDate = (date: Date | string | undefined): Date => {

    const ISO_DATE_FORMAT = 'dd-MM-yyyy';
    const refDate = new Date();

    refDate.setFullYear(9999, 1, 1);

    if (!date) {
        return refDate;
    } else if (typeof date === 'string') {
        const [day, month, year] = date.split('/');
        const toDate = new Date(+day, +month - 1, +year);
        //return toDate;
        const newdate = new Date(date);
        return newdate;

    } else {
        return date;
    }

};

export const stringToBoolean = (activePasive: string): boolean => {

    if (activePasive == 'Activo') {
        return false;
    } else {
        return true;
    }

};

export enum RegularisationClassificationCodes {
    P = 'P',
    Q = 'Q',
}
export const RegularisationClassificationDescription: Record<RegularisationClassificationCodes, string> = {
    'P': 'regularisation.label.classification.p',
    'Q': 'regularisation.label.classification.q'
};

export enum RegularisationBalanceCodes {
    I = 'I',
    D = 'D',
}
export const RegularisationBalanceDescription: Record<RegularisationBalanceCodes, string> = {
    'I': 'regularisation.label.increment',
    'D': 'regularisation.label.decrement'
};

export enum BillingStates {
    PENDING_GENERATE = '0', // 'Facturación establecimiento pendiente de aceptar',
    PENDING_ACCEPTANCE = '1', // 'Facturación establecimiento pendiente de aceptar',
    ACCEPTED = '2', // 'Facturación establecimiento aceptada',
    CONFIRMED = '3', // 'Facturación establecimiento confirmada',
    CLOSED = '4', // 'Facturación establecimiento cerrada',
}
export const billingEstablishmentStatesDisplay: Record<BillingStates, string> = {
    '0': 'Pdte. Generar',
    '1': 'Pdte. Aceptar',
    '2': 'Aceptada',
    '3': 'Confirmada',
    '4': 'Cerrada'
};

export enum ProductTypes {
    BASIC = '1',
    ALL = '2',
    EYES = '3',
    HEADSET = '4',
    EYES_HEADSET = '5',
    BASIC_EYES_HEADSET = '6',
}


export const ProductBasicType = 'BAS';

/**
 * Constantes auxiliares de parametros, configuracion interna
 */

export enum CodeMenusComponents {
    DISPENSATIONS = 'Dispensations',
    BILLING = 'Billing',
    BILLING_HISTORY = 'BillingHistory',
    ADJUSTMENT_ADMINISTRATION = 'Adjustment',
    ESTABLISHMENT_ADMINISTRATION = 'Establishment',
    PROFESIONAL_ADMINISTRATION = 'Profesional',
    LISTED = 'Listed',
}

export enum BillingModes {
    BILLING = 'BILLING',
    HISTORY = 'HISTORY',
}


export enum ParamsAux {
    SELECT_RADIOBUTTON = '1',
    RESET_RADIOBUTTON = '',
    OPERATOR_AND = 'AND',
}

export enum Format {
    JSON = 'json',
    XML = 'xml',
    PATCH_JSON = 'json-patch+json',
}

export const WacomState = true;

/**
 * Constantes para la Auditoría
 */
export class AtnaRegistrationConstants {
    static AUDIT_APP_NAME = 'hnanexo';
    static ACTION_CREATE = 'C';
    static ACTION_UPDATE = 'U';
    static ACTION_DELETE = 'D';
    static ACTION_EXECUTE = 'E';
    static ACTION_READ = 'R';
    static SUBTYPE_CODE_CREATE_DRAFT = 'hnanexo_create_draft_prescription';
    static SUBTYPE_CODE_CREATE = 'hnanexo_create_prescription';
    static SUBTYPE_CODE_UPDATE = 'hnanexo_update_prescription';
    static SUBTYPE_CODE_UPDATE_SSCC = 'hnanexo_update_prescription_SSCC';
    static SUBTYPE_CODE_DELETE = 'hnanexo_delete_elaboration_prescription';
    static SUBTYPE_CODE_CONSULT = 'hnanexo_consult_prescription';
    static SUBTYPE_CODE_CANCEL = 'hnanexo_cancel_prescription';
    static SUBTYPE_CODE_CANCEL_ADMIT_BLOCKING = 'hnanexo_cancel_admit_blocking';
    static SUBTYPE_CODE_REJECTING_PRECAUTIONARY_BLOCKING = 'hnanexo_rejecting_precautionary_blocking';
    static SUBTYPE_CODE_USER_LOGIN_DISPENSATION = 'disporto_user_login_dispensation';
    static SUBTYPE_CODE_RESERVE_DISPENSATION = 'disporto_reserve_dispensation';
    static SUBTYPE_CODE_DISPENSE_PRESCRIPTION = 'disporto_dispense_prescription';
    static SUBTYPE_CODE_PRECAUTIONARY_BLOCKING = 'disporto_precautionary_blocking';
    static SUBTYPE_CODE_RESERVE_MODIFY = 'disporto_reserve_modify';
    static SUBTYPE_CODE_DISPENSATION_MODIFY = 'disporto_dispensation_modify';
    static SUBTYPE_CODE_VALIDATE = 'hnanexo_validate_prescription';
    static SUBTYPE_CODE_DISCARD_VALIDATE = 'hnanexo_discard_validate_prescription';
    static SUBTYPE_DISPLAY_CREATE_DRAFT = 'Create Prescription Draft Application Registration';
    static SUBTYPE_DISPLAY_CREATE = 'Create Prescription Application Registration';
    static SUBTYPE_DISPLAY_UPDATE = 'Update Prescription Application Registration';
    static SUBTYPE_DISPLAY_UPDATE_SSCC = 'Update SSCC Prescription Application Registration';
    static SUBTYPE_DISPLAY_DELETE = 'Delete Prescription Elaboration Application Registration';
    static SUBTYPE_DISPLAY_CONSULT = 'Consult Prescription Applicaction Registration';
    static SUBTYPE_DISPLAY_CANCEL = 'Cancel Prescription Application Registration';
    static SUBTYPE_DISPLAY_CANCEL_ADMIT_BLOCKING = 'Cancellation Prescription After Accepting Precautionary Blocking';
    static SUBTYPE_DISPLAY_REJECTING_PRECAUTIONARY_BLOCKING = 'Rejecting Precautionary Blocking of prescription';
    static SUBTYPE_DISPLAY_VALIDATE = 'Validate Prescription Application Registration';
    static SUBTYPE_DISPLAY_DISCARD_VALIDATE = 'Discard Validate Prescription Application Registration';
    static SUBTYPE_DISPLAY_USER_LOGIN_DISPENSATION = 'Login Access Dispensation Application Registration';
    static SUBTYPE_DISPLAY_RESERVE_DISPENSATION = 'Reserve Dispensation Application Registration';
    static SUBTYPE_DISPLAY_DISPENSE_PRESCRIPTION = 'Dispense Prescription Application Registration';
    static SUBTYPE_DISPLAY_PRECAUTIONARY_BLOCKING = 'Precautionary Blocking of Prescription in Dispensation';
    static SUBTYPE_DISPLAY_RESERVE_MODIFY = 'Reserve Modify of Prescription in Dispensation';
    static SUBTYPE_DISPLAY_DISPENSATION_MODIFY = 'Dispensation Modify';
    static IDENTIFIER_CIPA_PATIENT = 'cipa';
    static IDENTIFIER_DNI_PATIENT = 'dni';
    static IDENTIFIER_PRSID_PATIENT = 'prsid';
    static IDENTIFIER_PASSPORT_PATIENT = 'passport';
    static IDENTIFIER_NUM_COLEGIADO_PRACTITIONER = 'num_colegiado';
    static IDENTIFIER_CIAS_PRACTITIONER = 'cias';
    static IDENTIFIER_DNI_PRACTITIONER = 'dni';
    static PATH_FHIR = '/fhir';
    static APP_SOURCE = 'Dispens. Ortoprótesis';
    static SUBTYPE_CODE_APPROVAL_ACCEPT = 'hnanexo_approval_accept';
    static SUBTYPE_CODE_APPROVAL_DENY = 'hnanexo_approval_deny';
    static SUBTYPE_DISPLAY_APPROVAL_ACCEPT = 'Approve prescription in approval module';
    static SUBTYPE_DISPLAY_APPROVAL_DENY = 'Deny prescription in approval module';
}
/** Constantes URL Practitioner */
export class FhirPractitionerUrl {
    static URL_PRACTITIONER_CIAS: string;
    static URL_PRACTITIONER_NUM_COLEGIADO: string;
    static URL_PRACTITIONER_DNI: string;
    static URL_PRACTITIONER_CPF: string;
}
export class FhirResourceType {
    static MESSAGE_HEADER: string;
    static BUNDLE: string;
    static REQUEST_GROUP: string;
    static IDREQUEST_GROUP: string;
    static ORGANIZATION: string;
    static PRACTITIONER_ROLE: string;
    static PRACTITIONER: string;
    static PATIENT: string;
    static ENCOUNTER: string;
    static DEVICE_REQUEST: string;
    static DEVICE: string;
    static QUESTTIONNAIRERESPONSE: string;
    static CONDITION: string;
    static DEVICES: string;
    static DEVICES_REQUEST: string;
    static OPERATION_OUTCOME: string;
    static BINARY: string;
}
export class FhirPatient {
    static DNI_SYSTEM: string;
    static CIPA_SYSTEM: string;
    static PASSPORT_SYSTEM: string;
    static PRSID_SYSTEM: string;
    static NAME_FATHERS_FAMILY: string;
    static NAME_MOTHERS_FAMILY: string;
    static NATIONALITY: string;
    static BASIC_HEALTH_AREA: string;
    static PHARMACY_INDICATOR: string;
    static PATIENT_SITUATION: string;
    static PROVINCE: string;
    static BARCODE: string;
    static PATIENT_DISABILITY: string;
}
export class ResourcesSharedFHIR {
    static FHIR_REFERENCES_SHARED_RESOURCES: string;
    static ORGANIZATION_CENTER_LOGGIN: string;
    static ORGANIZATION_SERVICE_LOGGIN: string;
    static PRACTITIONER_LOGIN: string;
}
