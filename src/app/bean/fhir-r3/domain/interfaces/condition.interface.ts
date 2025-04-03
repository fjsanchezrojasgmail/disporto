//import { Condition } from "fhir/r3";
//const orgininal: Condition

import { ClinicalStatus, VerificationStatus } from "../../fhir-constants";
import { Annotation, BackboneElement, CodeableConcept, DomainResource, Identifier, Reference } from "./common.interface";

/**
 * A clinical condition, problem, diagnosis, or other event, situation, issue, or clinical concept that has risen to a level of concern.
 */
 export interface Condition extends DomainResource {
    readonly resourceType: 'Condition';
    abatementDateTime?: string;
    //abatementAge?: Age;
    //abatementBoolean?: boolean;
    //abatementPeriod?: Period;
    //abatementRange?: Range;
    //abatementString?: string;
    assertedDate?: string;
    asserter?: Reference;
    bodySite?: CodeableConcept[];
    category?: CodeableConcept[];
    clinicalStatus?: ClinicalStatus;
    code?: CodeableConcept;
    context?: Reference;
    evidence?: ConditionEvidence[];
    identifier?: Identifier[];
    note?: Annotation[];
    onsetDateTime?: string;
    //onsetAge?: Age;
    //onsetPeriod?: Period;
    //onsetRange?: Range;
    //onsetString?: string;
    severity?: CodeableConcept;
    stage?: ConditionStage;
    subject: Reference;
    verificationStatus?: VerificationStatus;
}

/**
 * The evidence may be a simple list of coded symptoms/manifestations, or references to observations or formal assessments, or both.
 */
 export interface ConditionEvidence extends BackboneElement {
    code?: CodeableConcept[];
    detail?: Reference[];
}

/**
 * Clinical stage or grade of a condition. May include formal severity assessments.
 */
export interface ConditionStage extends BackboneElement {
    assessment?: Reference[];
    summary?: CodeableConcept;
}