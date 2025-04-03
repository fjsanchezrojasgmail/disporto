import { UdiEntryType, DeviceStatus } from '../../fhir-constants';
import { Annotation, BackboneElement, CodeableConcept, DomainResource, Identifier, Reference, ContactPoint, Period } from "./common.interface";

/**
 * This resource identifies an instance or a type of a manufactured item that is used in the provision of healthcare without being substantially 
 * changed through that activity. The device may be a medical or non-medical device. Medical devices include durable (reusable) medical equipment, 
 * implantable devices, as well as disposable equipment used for diagnostic, treatment, and research for healthcare and public health. 
 * Non-medical devices may include items such as a machine, cellphone, computer, application, etc.
 */
export interface Device extends DomainResource {
    identifier?: Identifier[];
    udi?: DeviceUdi;
    status?: DeviceStatus;
    //status?: ('active'|'inactive'|'entered-in-error'|'unkown'); //FHIRDeviceStatus http://hl7.org/fhir/stu3/valueset-device-status.html
    type?: CodeableConcept;
    lotNumber?: string;
    manufacturer?: string;
    manufactureDate?: Date //Datetime
    expirationDate?: Date //Datetime
    model?: string;
    version?: string;
    patient?: Reference;
    owner?: Reference;
    contact?: ContactPoint;
    location?: Reference;
    url?: string; //Uri
    note?: Annotation[];
    safety?: CodeableConcept;

}

/**
 * Unique device identifier (UDI) assigned to device label or package.
 */
export interface DeviceUdi extends BackboneElement {
    deviceIdentifier?: string;
    name?: string;
    jurisdiction?: string; //uri
    carrierHRF?: string;
    carrierAIDC?: string;
    issuer?: Reference;
    entryType?: UdiEntryType;
    //entryType?: ('barcode'|'rfid'|'manual'|'card'|'self-reported'|'unknown') //UDIEntryType http://hl7.org/fhir/stu3/valueset-udi-entry-type.html

}