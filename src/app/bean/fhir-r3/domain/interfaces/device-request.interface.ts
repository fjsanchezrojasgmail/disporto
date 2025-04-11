import { DeviceRequestStatus } from '../../fhir-constants';
//import { DeviceRequest } from "fhir/r3";
//const origin: DeviceRequest

import { BackboneElement, CodeableConcept, DomainResource, Identifier, Reference } from "./common.interface";

/**
 * Represents a request for a patient to employ a medical device. The device may be an implantable device, or an external assistive device, such as a walker.
 */
 export interface DeviceRequest extends DomainResource {
    readonly resourceType: 'DeviceRequest';
    authoredOn?: Date; //string(origin type) > Date
    //basedOn?: Reference[];
    codeReference?: Reference;
    //codeCodeableConcept?: CodeableConcept;
    context?: Reference;
    //definition?: Reference[];
    //groupIdentifier?: Identifier;
    identifier?: Identifier[];
    intent: CodeableConcept;
    //note?: Annotation[];
    //occurrenceDateTime?: string;
    //occurrencePeriod?: Period;
    //occurrenceTiming?: Timing;
    performer?: Reference;
    //performerType?: CodeableConcept;
    //priority?: string;
    //priorRequest?: Reference[];
    //reasonCode?: CodeableConcept[];
    reasonReference?: Reference[];
    //relevantHistory?: Reference[];
    requester?: DeviceRequestRequester;
    status?: DeviceRequestStatus;
    //status?: ('draft'|'active'|'suspended'|'cancelled'|'completed'|'entered-in-error'|'unknown');
    subject: Reference;
    supportingInfo?: Reference[];
}

/**
 * The individual who initiated the request and has responsibility for its activation.
 */
export interface DeviceRequestRequester extends BackboneElement {
    agent: Reference;
    //onBehalfOf?: Reference;
}