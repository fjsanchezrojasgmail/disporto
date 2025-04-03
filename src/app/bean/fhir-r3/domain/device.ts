import { DeviceStatus } from '../fhir-constants';
import { Annotation, CodeableConcept, ContactPoint, Extension, Identifier, Meta, Narrative, Reference, Resource } from "./interfaces/common.interface";
import { Device, DeviceUdi } from "./interfaces/device.interface";

export class DeviceModel implements Device {
    readonly resourceType = "Device";
    identifier?: Identifier[];
    udi?: DeviceUdi;
    status?: DeviceStatus;
    // status?: 'active' | 'inactive' | 'entered-in-error' | 'unkown';
    type?: CodeableConcept;
    lotNumber?: string;
    manufacturer?: string;
    manufactureDate?: Date;
    expirationDate?: Date;
    model?: string;
    version?: string;
    patient?: Reference;
    owner?: Reference;
    contact?: ContactPoint;
    location?: Reference;
    url?: string;
    note?: Annotation[];
    safety?: CodeableConcept;
    contained?: Resource[];
    extension?: Extension[];
    modifierExtension?: Extension[];
    text?: Narrative;
    id?: string;
    implicitRules?: string;
    language?: string;
    meta?: Meta;

    constructor(device: Device){
        this.identifier = device.identifier;
        this.udi = device.udi;
        this.status = device.status;
        this.type = device.type;
        this.lotNumber = device.lotNumber;
        this.manufacturer = device.manufacturer;
        this.manufactureDate = device.manufactureDate;
        this.expirationDate = device.expirationDate;  
        this.model = device.model;
        this.version = device.version;
        this.patient = device.patient;
        this.owner = device.owner;
        this.contact = device.contact;
        this.location = device.location;
        this.url = device.url;
        this.note = device.note;
        this.safety = device.safety;
        this.extension = device.extension;
        this.modifierExtension = device.modifierExtension;
        this.text = device.text;
        this.id = device.id;
        this.implicitRules = device.implicitRules;
        this.language = device.language;
        this.meta = device.meta;
    }

    mapToFhir(): Device {
        return this as Device;
    }


}