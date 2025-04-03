import { Gender } from "../../fhir-constants";
import { Address, Attachment, BackboneElement, CodeableConcept, ContactPoint, DomainResource, HumanName, Identifier, Period, Reference } from "./common.interface";

/**
 * A person who is directly or indirectly involved in the provisioning of healthcare.
 */
 export interface Practitioner extends DomainResource {
    readonly resourceType: 'Practitioner';
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
}

/**
 * Qualifications obtained by training and certification.
 */
 export interface PractitionerQualification extends BackboneElement {
    code: CodeableConcept;
    identifier?: Identifier[];
    issuer?: Reference;
    period?: Period;
}