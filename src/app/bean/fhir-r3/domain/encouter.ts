import { EncounterStatus } from "../fhir-constants";
import { Reference, Coding, Identifier, Quantity, Period, CodeableConcept, Resource, Extension, Narrative, Meta } from "./interfaces/common.interface";
import { EncounterDiagnosis, EncounterHospitalization, EncounterLocation, EncounterParticipant, EncounterStatusHistory, Encounter } from "./interfaces/encounter.interface";

export class EncounterModel implements Encounter {
    readonly resourceType = "Encounter";
    appointment?: Reference;
    class?: Coding;
    diagnosis?: EncounterDiagnosis[];
    episodeOfCare?: Reference[];
    hospitalization?: EncounterHospitalization;
    identifier?: Identifier[];
    incomingReferral?: Reference[];
    length?: Quantity;
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
    contained?: Resource[];
    extension?: Extension[];
    modifierExtension?: Extension[];
    text?: Narrative;
    id?: string;
    implicitRules?: string;
    language?: string;
    meta?: Meta;
    
    constructor(encounter: Encounter) {
        this.appointment = encounter.appointment;
        this.class = encounter.class;
        this.contained = encounter.contained;
        this.diagnosis = encounter.diagnosis;
        this.episodeOfCare = encounter.episodeOfCare;
        this.extension = encounter.extension;
        this.hospitalization = encounter.hospitalization;
        this.id = encounter.id;
        this.identifier = encounter.identifier;
        this.implicitRules = encounter.implicitRules;
        this.incomingReferral = encounter.incomingReferral;
        this.language = encounter.language;
        this.length = encounter.length;
        this.location = encounter.location;
        this.meta = encounter.meta;
        this.modifierExtension = encounter.modifierExtension;
        this.partOf = encounter.partOf;
        this.participant = encounter.participant;
        this.period = encounter.period;
        this.priority = encounter.priority;
        this.reason = encounter.reason;
        this.serviceProvider = encounter.serviceProvider;
        this.status = encounter.status;
        this.statusHistory = encounter.statusHistory;
        this.subject = encounter.subject;
        this.text = encounter.text;
        this.type = encounter.type;
    }

    mapToFhir(): Encounter {
        return this as Encounter;
    }
    
}