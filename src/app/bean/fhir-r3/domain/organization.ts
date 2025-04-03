import { Identifier, Reference, CodeableConcept, Resource, Extension, Narrative, Meta } from "./interfaces/common.interface";
import { Organization } from "./interfaces/organization.interface";

export class OrganizationModel implements Organization {
    readonly resourceType = "Organization";
    active?: boolean;
    identifier?: Identifier[];
    name?: string;
    partOf?: Reference;
    type?: CodeableConcept[];
    contained?: Resource[];
    extension?: Extension[];
    modifierExtension?: Extension[];
    text?: Narrative;
    id?: string;
    implicitRules?: string;
    language?: string;
    meta?: Meta;
    
    constructor(organization: Organization) {
        this.active = organization.active;
        this.contained = organization.contained;
        this.extension = organization.extension;
        this.id = organization.id;
        this.identifier = organization.identifier;
        this.implicitRules = organization.implicitRules;
        this.language = organization.language;
        this.meta = organization.meta;
        this.modifierExtension = organization.modifierExtension;
        this.name = organization.name;
        this.partOf = organization.partOf;
        this.text = organization.text;
        this.type = organization.type;
    }

    mapToFhir(): Organization {
        return this as Organization;
    }
}