import { DeviceRequestStatus } from '../fhir-constants';
import { Reference, Identifier, Resource, Extension, Narrative, Meta } from './interfaces/common.interface';
import { DeviceRequestRequester, DeviceRequest } from './interfaces/device-request.interface';

export class DeviceRequestModel implements DeviceRequest {

    readonly resourceType = 'DeviceRequest';
    authoredOn?: Date;
    codeReference?: Reference;
    context?: Reference;
    identifier?: Identifier[];
    performer?: Reference;
    reasonReference?: Reference[];
    requester?: DeviceRequestRequester;
    status?: DeviceRequestStatus;
    subject: Reference;
    supportingInfo?: Reference[];
    contained?: Resource[];
    extension?: Extension[];
    modifierExtension?: Extension[];
    text?: Narrative;
    id?: string;
    implicitRules?: string;
    language?: string;
    meta?: Meta;

    constructor(deviceRequest: DeviceRequest){
        this.resourceType = deviceRequest.resourceType;
        this.authoredOn = deviceRequest.authoredOn;
        this.codeReference = deviceRequest.codeReference;
        this.context = deviceRequest.context;
        this.identifier = deviceRequest.identifier;
        this.performer = deviceRequest.performer;
        this.reasonReference = deviceRequest.reasonReference;
        this.requester = deviceRequest.requester;
        this.status = deviceRequest.status;
        this.subject = deviceRequest.subject;
        this.supportingInfo = deviceRequest.supportingInfo;
        this.contained = deviceRequest.contained;
        this.extension = deviceRequest.extension;
        this.modifierExtension = deviceRequest.modifierExtension;
        this.text = deviceRequest.text;
        this.id = deviceRequest.id;
        this.implicitRules = deviceRequest.implicitRules;
        this.language = deviceRequest.language;
        this.meta = deviceRequest.meta;
    }

    mapToFhir(): DeviceRequest {
        return this as DeviceRequest;
    }


}