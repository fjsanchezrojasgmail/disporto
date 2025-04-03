import { EncounterStatus } from "../../fhir-constants";
import { BackboneElement, CodeableConcept, Coding, DomainResource, Duration, Identifier, Period, Reference } from "./common.interface";

/**
 * An interaction between a patient and healthcare provider(s) for the purpose of providing healthcare service(s) or assessing the health status of a patient.
 */
 export interface Encounter extends DomainResource {
    /** Resource Type Name (for serialization) */
    readonly resourceType: 'Encounter';

    //account?: Reference[];
    appointment?: Reference;
    class?: Coding;
    //classHistory?: EncounterClassHistory[];
    diagnosis?: EncounterDiagnosis[];
    episodeOfCare?: Reference[];
    hospitalization?: EncounterHospitalization;
    identifier?: Identifier[];
    incomingReferral?: Reference[];
    length?: Duration;
    location?: EncounterLocation[];
    participant?: EncounterParticipant[];
    partOf?: Reference;
    period?: Period;
    priority?: CodeableConcept;
    reason?: CodeableConcept[];
    serviceProvider?: Reference;
    status: EncounterStatus;
    statusHistory?: EncounterStatusHistory[];
    subject?: Reference;
    type?: CodeableConcept[];
}

/**
 * The current status is always found in the current version of the resource, not the status history.
 */
export interface EncounterStatusHistory extends BackboneElement {
    period: Period;
    status: ('planned'|'arrived'|'triaged'|'in-progress'|'onleave'|'finished'|'cancelled'|'entered-in-error'|'unknown');
}

/**
   * The class history permits the tracking of the encounters transitions without needing to go  through the resource history.
   * This would be used for a case where an admission starts of as an emergency encounter, then transisions into an inpatient scenario. Doing this and not restarting a new encounter ensures that any lab/diagnostic results can more easily follow the patient and not require re-processing and not get lost or cancelled during a kindof discharge from emergency to inpatient.
   */
export interface EncounterClassHistory extends BackboneElement {
    class: Coding;
    period: Period;
}
/**
   * The list of people responsible for providing the service.
   */
export interface EncounterParticipant extends BackboneElement {
    individual?: Reference;
    period?: Period;
    type?: CodeableConcept[];
}
/**
   * The list of diagnosis relevant to this encounter.
   */
export interface EncounterDiagnosis extends BackboneElement {
    condition: Reference;
    rank?: number;
    role?: CodeableConcept;
}
/**
   * An Encounter may cover more than just the inpatient stay. Contexts such as outpatients, community clinics, and aged care facilities are also included.
   * The duration recorded in the period of this encounter covers the entire scope of this hospitalization record.
   */
export interface EncounterHospitalization extends BackboneElement {
    admitSource?: CodeableConcept;
    destination?: Reference;
    dietPreference?: CodeableConcept[];
    dischargeDisposition?: CodeableConcept;
    origin?: Reference;
    preAdmissionIdentifier?: Identifier;
    reAdmission?: CodeableConcept;
    specialArrangement?: CodeableConcept[];
    specialCourtesy?: CodeableConcept[];
}
/**
   * Virtual encounters can be recorded in the Encounter by specifying a location reference to a location of type "kind" such as "client's home" and an encounter.class = "virtual".
   */
export interface EncounterLocation extends BackboneElement {
    location: Reference;
    period?: Period;
    status?: ('planned'|'active'|'reserved'|'completed');
}