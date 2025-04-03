export enum FhirTypes {
    BUNDLE = 'Bundle',
    CONDITION = 'Condition',
    DEVICE_REQUEST = 'DeviceRequest',
    DEVICE = 'Device',
    ENCOUNTER = 'Encounter',
    ORGANIZATION = 'Organization',
    PATIENT = 'Patient',
    PRACTITIONER = 'Practitioner',
    REQUEST_GROUP = 'RequestGroup',
    OPERATION_OUTCOME = 'OperationOutcome',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
    UNKNOWN = 'unknown',
}

export enum EncounterStatus {
    UNKNOWN = 'unknown',
    PLANNED = 'planned',
    ARRIVED = 'arrived',
    TRIAGED = 'triaged',
    IN_PROGRESS = 'in-progress',
    ONLEAVE = 'onleave',
    FINISHED = 'finished',
    CANCELLED = 'cancelled',
    ENTERED_IN_ERROR = 'entered-in-error',
}

export enum VerificationStatus {
    UNKNOWN = 'unknown',
    ENTERED_IN_ERROR = 'entered-in-error',
    PROVISIONAL = 'provisional',
    DIFFERENTIAL = 'differential',
    CONFIRMED = 'confirmed',
    REFUTED = 'refuted',    
}

export enum ClinicalStatus {
    ACTIVE = 'active',
    RECURRENCE = 'recurrence',
    INACTIVE = 'inactive',
    REMISSION = 'remission',
    RESOLVED = 'resolved',
}
export enum UdiEntryType {
    BARCODE = 'barcode',
    RFID = 'rfid',
    MANUAL = 'manual',
    CARD = 'card',
    SELF_REPORTED = 'self-reported',
    UNKNOWN = 'unknown',
}

export enum DeviceStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    ENTERED_IN_ERROR = 'entered-in-error',
    UNKNOWN = 'unknown',
}

export enum DeviceRequestStatus {
    UNKNOWN = 'unknown',
    DRAFT = 'draft',
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
    ENTERED_IN_ERROR = 'entered-in-error',
}

export enum RequestGroupIntent {
    PROPOSAL = 'proposal',
    PLAN = 'plan',
    ORDER = 'order',
    ORIGINAL_ORDER = 'original-order',
    REFLEX_ORDER = 'reflex-order',
    FILLER_ORDER = 'filler-order',
    INSTANCE_ORDER = 'instance-order',
    OPTION = 'option',
}

export enum RequestGroupStatus {
    CANCELLED = 'cancelled',
    ENTERED_IN_ERROR = 'entered-in-error',
    UNKNOWN = 'unknown',
    ACTIVE = 'active',
    COMPLETED = 'completed',
    DRAFT = 'draft',
    SUSPENDED = 'suspended',
}

export enum RequestGroupPriority {
    ROUTINE = 'routine',
    URGENT = 'urgent',
    ASAP = 'asap',
    STAT = 'stat',
}

export enum FhirValue {
    YES = 'S',
    NO = 'N',
}