import { Attachment, BackboneElement, CodeableConcept, DomainResource, Identifier, Period, Quantity, Ratio, Reference, SampledData } from "./common.interface";

/**
 * Measurements and simple assertions made about a patient, device or other subject.
 */
export interface Observation extends DomainResource {
    /** Resource Type Name (for serialization) */
    readonly resourceType: 'Observation';
    basedOn?: Reference[];
    bodySite?: CodeableConcept;
    category?: CodeableConcept[];
    code: CodeableConcept;
    comment?: string;
    component?: ObservationComponent[];
    context?: Reference;
    dataAbsentReason?: CodeableConcept;
    device?: Reference;
    effectiveDateTime?: string;
    effectivePeriod?: Period;
    identifier?: Identifier[];
    interpretation?: CodeableConcept;
    issued?: string;
    method?: CodeableConcept;
    performer?: Reference[];
    referenceRange?: ObservationReferenceRange[];
    related?: ObservationRelated[];
    specimen?: Reference;
    status: ('registered'|'preliminary'|'final'|'amended'|'corrected'|'cancelled'|'entered-in-error'|'unknown');
    subject?: Reference;
    valueQuantity?: Quantity;
    valueCodeableConcept?: CodeableConcept;
    valueString?: string;
    valueBoolean?: boolean;
    valueRange?: Range;
    valueRatio?: Ratio;
    valueSampledData?: SampledData;
    valueAttachment?: Attachment;
    valueTime?: string;
    valueDateTime?: string;
    valuePeriod?: Period;
}
/**
 * Most observations only have one generic reference range. Systems MAY choose to restrict to only supplying the relevant reference range based on knowledge about the patient (e.g., specific to the patient's age, gender, weight and other factors), but this may not be possible or appropriate. Whenever more than one reference range is supplied, the differences between them SHOULD be provided in the reference range and/or age properties.
 */
 export interface ObservationReferenceRange extends BackboneElement {
    age?: Range;
    appliesTo?: CodeableConcept[];
    high?: Quantity;
    low?: Quantity;
    text?: string;
    type?: CodeableConcept;
  }
  /**
   * For a discussion on the ways Observations can assembled in groups together see [Notes below](observation.html#4.20.4).
   */
  export interface ObservationRelated extends BackboneElement {
    target: Reference;
    type?: ('has-member'|'derived-from'|'sequel-to'|'replaces'|'qualified-by'|'interfered-by');
  }
  /**
   * For a discussion on the ways Observations can be assembled in groups together see [Notes](observation.html#notes) below.
   */
  export interface ObservationComponent extends BackboneElement {
    code: CodeableConcept;
    dataAbsentReason?: CodeableConcept;
    interpretation?: CodeableConcept;
    referenceRange?: ObservationReferenceRange[];
    valueQuantity?: Quantity;
    valueCodeableConcept?: CodeableConcept;
    valueString?: string;
    valueRange?: Range;
    valueRatio?: Ratio;
    valueSampledData?: SampledData;
    valueAttachment?: Attachment;
    valueTime?: string;
    valueDateTime?: string;
    valuePeriod?: Period;
}