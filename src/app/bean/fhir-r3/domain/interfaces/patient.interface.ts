import { Gender } from "../../fhir-constants";
import { Address, Attachment, BackboneElement, CodeableConcept, ContactPoint, DomainResource, HumanName, Identifier, Period, Reference } from "./common.interface";

/**
 * Demographics and other administrative information about an individual or animal receiving care or other health-related services.
 */
 export interface Patient extends DomainResource {
    readonly resourceType: 'Patient';
    active?: boolean;
    address?: Address[];
    animal?: PatientAnimal;
    birthDate?: Date | string;
    communication?: PatientCommunication[];
    contact?: PatientContact[];
    deceasedBoolean?: boolean;
    deceasedDateTime?: string;
    gender?: Gender;
    generalPractitioner?: Reference[];
    identifier?: Identifier[];
    link?: PatientLink[];
    managingOrganization?: Reference;
    maritalStatus?: CodeableConcept;
    multipleBirthBoolean?: boolean;
    multipleBirthInteger?: number;
    name: HumanName[];
    photo?: Attachment[];
    telecom?: ContactPoint[];
}

/**
 * The animal element is labeled "Is Modifier" since patients may be non-human. Systems SHALL either handle patient details appropriately (e.g. inform users patient is not human) or reject declared animal records.   The absense of the animal element does not imply that the patient is a human. If a system requires such a positive assertion that the patient is human, an extension will be required.  (Do not use a species of homo-sapiens in animal species, as this would incorrectly infer that the patient is an animal).
 */
 export interface PatientAnimal extends BackboneElement {
    breed?: CodeableConcept;
    genderStatus?: CodeableConcept;
    species: CodeableConcept;
}

/**
 * If no language is specified, this *implies* that the default local language is spoken.  If you need to convey proficiency for multiple modes then you need multiple Patient.Communication associations.   For animals, language is not a relevant field, and should be absent from the instance. If the Patient does not speak the default local language, then the Interpreter Required Standard can be used to explicitly declare that an interpreter is required.
 */
 export interface PatientCommunication extends BackboneElement {
    language: CodeableConcept;
    preferred?: boolean;
}

/**
 * Contact covers all kinds of contact parties: family members, business contacts, guardians, caregivers. Not applicable to register pedigree and family ties beyond use of having contact.
 */
 export interface PatientContact extends BackboneElement {
    address?: Address;
    gender?: ('male'|'female'|'other'|'unknown');
    name?: HumanName;
    organization?: Reference;
    period?: Period;
    relationship?: CodeableConcept[];
    telecom?: ContactPoint[];
}

/**
 * There is no assumption that linked patient records have mutual links.
 * This element is labelled as a modifier because it may not be the main Patient resource, and the referenced patient should be used instead of this Patient record. This is when the link.type value is 'replaced-by'.
 */
 export interface PatientLink extends BackboneElement {
    other: Reference;
    type: ('replaced-by'|'replaces'|'refer'|'seealso');
}