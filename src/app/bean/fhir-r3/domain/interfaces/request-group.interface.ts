import { RequestGroupIntent, RequestGroupPriority, RequestGroupStatus } from "../../fhir-constants";
import { Annotation, BackboneElement, CodeableConcept, Coding, DomainResource, Identifier, Reference } from "./common.interface";

/**
 * A group of related requests that can be used to capture intended activities that have inter-dependencies such as "give this medication after that one".
 */
 export interface RequestGroup extends DomainResource {
    readonly resourceType: 'RequestGroup';
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
}

/**
 * The actions, if any, produced by the evaluation of the artifact.
 */
export interface RequestGroupAction extends BackboneElement {
    //action?: RequestGroupAction[];
    //cardinalityBehavior?: ('single'|'multiple');
    code?: CodeableConcept[];
    //condition?: RequestGroupActionCondition[];
    description?: string;
    //documentation?: RelatedArtifact[];
    //groupingBehavior?: ('visual-group'|'logical-group'|'sentence-group');
    label?: string;
    participant?: Reference[];
    //precheckBehavior?: ('yes'|'no');
    //relatedAction?: RequestGroupActionRelatedAction[];
    //requiredBehavior?: ('must'|'could'|'must-unless-documented');
    resource?: Reference;
    //selectionBehavior?: ('any'|'all'|'all-or-none'|'exactly-one'|'at-most-one'|'one-or-more');
    //textEquivalent?: string;
    timingDateTime?: Date;//string;
    //timingPeriod?: Period;
    //timingDuration?: Duration;
    //timingRange?: Range;
    //timingTiming?: Timing;
    //title?: string;
    type?: Coding;
}