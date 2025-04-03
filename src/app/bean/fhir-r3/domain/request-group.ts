import { RequestGroupIntent, RequestGroupPriority, RequestGroupStatus } from "../fhir-constants";
import { Reference, Identifier, Annotation, CodeableConcept, Resource, Extension, Narrative, Meta } from "./interfaces/common.interface";
import { RequestGroup, RequestGroupAction } from "./interfaces/request-group.interface";

export class RequestGroupModel implements RequestGroup {

    readonly resourceType = "RequestGroup";
    action?: RequestGroupAction[];
    author?: Reference;
    authoredOn?: string;
    basedOn?: Reference[];
    context?: Reference;
    definition?: Reference[];
    groupIdentifier?: Identifier;
    identifier?: Identifier[];
    intent: RequestGroupIntent;
    note?: Annotation[];
    priority?: RequestGroupPriority;
    reasonCodeableConcept?: CodeableConcept;
    reasonReference?: Reference;
    replaces?: Reference[];
    status: RequestGroupStatus;
    subject?: Reference;
    contained?: Resource[];
    extension?: Extension[];
    modifierExtension?: Extension[];
    text?: Narrative;
    id?: string;
    implicitRules?: string;
    language?: string;
    meta?: Meta;

    constructor(requestGroup: RequestGroup) {
        this.action = requestGroup.action;
        this.author = requestGroup.author;
        this.authoredOn = requestGroup.authoredOn;
        this.basedOn = requestGroup.basedOn;
        this.contained = requestGroup.contained;
        this.context = requestGroup.context;
        this.definition = requestGroup.definition;
        this.extension = requestGroup.extension;
        this.groupIdentifier = requestGroup.groupIdentifier;
        this.id = requestGroup.id;
        this.identifier = requestGroup.identifier;
        this.implicitRules = requestGroup.implicitRules;
        this.intent = requestGroup.intent;
        this.language = requestGroup.language;
        this.meta = requestGroup.meta;
        this.modifierExtension = requestGroup.modifierExtension;
        this.note = requestGroup.note;
        this.priority = requestGroup.priority;
        this.reasonCodeableConcept = requestGroup.reasonCodeableConcept;
        this.reasonReference = requestGroup.reasonReference;
        this.replaces = requestGroup.replaces;
        this.status = requestGroup.status;
        this.subject = requestGroup.subject;
        this.text = requestGroup.text;
    }

    mapToFhir(): RequestGroup {
        return this as RequestGroup;
    }
}