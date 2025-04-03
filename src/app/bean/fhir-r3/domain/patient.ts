import { SimplePatient } from "../../models/patient";
import { Gender } from "../fhir-constants";
import { Address, Reference, Identifier, CodeableConcept, HumanName, Attachment, ContactPoint, Resource, Extension, Narrative, Meta } from "./interfaces/common.interface";
import { Patient, PatientAnimal, PatientCommunication, PatientContact, PatientLink } from "./interfaces/patient.interface";
import { FhirIdentifierSystem, FhirPatienUrl } from "../fhir-url-constants";

export class PatientModel implements Patient { 
    readonly resourceType = "Patient";
    active?: boolean;
    address?: Address[];
    animal?: PatientAnimal;
    birthDate?: string | Date;
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
    contained?: Resource[];
    extension?: Extension[];
    modifierExtension?: Extension[];
    text?: Narrative;
    id?: string;
    implicitRules?: string;
    language?: string;
    meta?: Meta;
    
    constructor(patient: Patient) {
        this.active = patient.active;
        this.address = patient.address;
        this.animal = patient.animal;
        this.birthDate = patient.birthDate;
        this.contained = patient.contained;
        this.communication = patient.communication;
        this.contact = patient.contact;
        this.deceasedBoolean = patient.deceasedBoolean;
        this.deceasedBoolean = patient.deceasedBoolean;
        this.deceasedDateTime = patient.deceasedDateTime;
        this.extension = patient.extension;
        this.gender = patient.gender;
        this.generalPractitioner = patient.generalPractitioner;
        this.id = patient.id;
        this.identifier = patient.identifier;
        this.implicitRules = patient.implicitRules;
        this.language = patient.language;
        this.language = patient.language;
        this.link = patient.link;
        this.managingOrganization = patient.managingOrganization;
        this.maritalStatus = patient.maritalStatus;
        this.meta = patient.meta;
        this.modifierExtension = patient.modifierExtension;
        this.multipleBirthBoolean = patient.multipleBirthBoolean;
        this.multipleBirthInteger = patient.multipleBirthInteger;
        this.name = patient.name;
        this.photo = patient.photo;
        this.telecom = patient.telecom;
        this.text = patient.text;
    }

    mapToFhir(): Patient {
        return this as Patient;
    }

    mapToModel(): SimplePatient {
        const pharmacy = this.extension?.find(e => e.url === FhirPatienUrl.PHARMACY_INDICATOR)?.valueCodeableConcept;
        const situation = this.extension?.find(e => e.url === FhirPatienUrl.SITUATION)?.valueCodeableConcept;
        const disability = this.extension?.find(e => e.url === FhirPatienUrl.DISABILITY)?.valueString;
        return {
            id: this.id || '',
            birthDate: this.birthDate,
            cipa: this.identifier?.find(i => i.system === FhirIdentifierSystem.CIPA)?.value,
            name: this.name[0].given?.join(' '),
            surnames: this.name[0].family,
            fullname: this.name[0].text,
            gender: this.gender,
            dni: this.identifier?.find(i => i.system === FhirIdentifierSystem.NNESP)?.value,
            situation: {
                code: situation?.coding?.at(0)?.code,
                text: situation?.text,
            },
            pharmacyIndicator: {
                code: pharmacy?.coding?.at(0)?.code,
                text: pharmacy?.text,
            },
            disability: Number(disability || 0),
        };
    }
}