import { ClinicalStatus, VerificationStatus } from "../fhir-constants";
import { Reference, CodeableConcept, Identifier, Annotation, Resource, Extension, Narrative, Meta } from "./interfaces/common.interface";
import { ConditionEvidence, ConditionStage, Condition } from "./interfaces/condition.interface";

export class ConditionModel implements Condition {
    readonly resourceType = "Condition";
    abatementDateTime?: string;
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
    severity?: CodeableConcept;
    stage?: ConditionStage;
    subject: Reference;
    verificationStatus?: VerificationStatus;
    contained?: Resource[];
    extension?: Extension[];
    modifierExtension?: Extension[];
    text?: Narrative;
    id?: string;
    implicitRules?: string;
    language?: string;
    meta?: Meta;

    constructor(condition: Condition) {
        this.abatementDateTime = condition.abatementDateTime;
        this.assertedDate = condition.assertedDate;
        this.asserter = condition.asserter;
        this.bodySite = condition.bodySite;
        this.category = condition.category;
        this.clinicalStatus = condition.clinicalStatus;
        this.code = condition.code;
        this.contained = condition.contained;
        this.evidence = condition.evidence;
        this.extension = condition.extension;
        this.id = condition.id;
        this.identifier = condition.identifier;
        this.identifier = condition.identifier;
        this.implicitRules = condition.implicitRules;
        this.language = condition.language;
        this.meta = condition.meta;
        this.modifierExtension = condition.modifierExtension;
        this.note = condition.note;
        this.onsetDateTime = condition.onsetDateTime;
        this.severity = condition.severity;
        this.stage = condition.stage;
        this.subject = condition.subject;
        this.text = condition.text;
        this.verificationStatus = condition.verificationStatus;
    }

    mapToFhir(): Condition {
        return this as Condition;
    }
}
