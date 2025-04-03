import { CodeableConcept, DomainResource, Identifier, Reference } from "./common.interface";

/**
 * A formally or informally recognized grouping of people or organizations formed for the purpose of achieving some form of collective action.  Includes companies, institutions, corporations, departments, community groups, healthcare practice groups, etc.
 */
 export interface Organization extends DomainResource {
    readonly resourceType: 'Organization';
    active?: boolean;
    //address?: Address[];
    //alias?: string[];
    //contact?: OrganizationContact[];
    //endpoint?: Reference[];
    identifier?: Identifier[];
    name?: string;
    partOf?: Reference;
    //telecom?: ContactPoint[];
    type?: CodeableConcept[];
}