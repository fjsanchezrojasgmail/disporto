import { Gender } from "../fhir-constants";
import { Address, CodeableConcept, Identifier, HumanName, Attachment, ContactPoint, Resource, Extension, Narrative, Meta } from "./interfaces/common.interface";
import { Practitioner, PractitionerQualification } from "./interfaces/practitioner.interface";

export class PractitionerModel implements Practitioner {
    readonly resourceType = "Practitioner";
    active?: boolean;
    address?: Address[];
    birthDate?: string;
    communication?: CodeableConcept[];
    gender?: Gender;
    identifier?: Identifier[];
    name: HumanName[];
    photo?: Attachment[];
    qualification?: PractitionerQualification[];
    telecom?: ContactPoint[];
    contained?: Resource[];
    extension?: Extension[];
    modifierExtension?: Extension[];
    text?: Narrative;
    id?: string;
    implicitRules?: string;
    language?: string;
    meta?: Meta;

    constructor(practitioner: Practitioner) {
        this.name = practitioner.name;
        this.active = practitioner.active;
        this.address = practitioner.address;
        this.birthDate = practitioner.birthDate;
        this.communication = practitioner.communication;
        this.contained = practitioner.contained;
        this.extension = practitioner.extension;
        this.gender = practitioner.gender;
        this.id = practitioner.id;
        this.identifier = practitioner.identifier;
        this.implicitRules = practitioner.implicitRules;
        this.language = practitioner.language;
        this.meta = practitioner.meta;
        this.modifierExtension = practitioner.modifierExtension;
        this.photo = practitioner.photo;
        this.qualification = practitioner.qualification;
        this.telecom = practitioner.telecom;
        this.text = practitioner.text;
    }

    mapToFhir(): Practitioner {
        return this as Practitioner;
    }

}