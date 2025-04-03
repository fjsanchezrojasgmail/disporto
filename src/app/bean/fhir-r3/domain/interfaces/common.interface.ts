// Este archivo esta basado en este import, se comentan las propiedades que no se van a usar
import { } from 'fhir/r3';

import { Condition } from './condition.interface';
import { DeviceRequest } from './device-request.interface';
import { Device } from './device.interface';
import { Encounter } from './encounter.interface';
import { Observation } from './observation';
import { Organization } from './organization.interface';
import { Patient } from './patient.interface';
import { Practitioner } from './practitioner.interface';
import { RequestGroup } from './request-group.interface';

export type FhirResource = Condition | DeviceRequest | Device | Encounter | Organization | Patient | Practitioner | RequestGroup | Observation;

/**
 * A resource that includes narrative, extensions, and contained resources.
 */
export interface DomainResource extends Resource {
    /** Resource Type Name (for serialization) */
    readonly resourceType: string;
    /**
     * This should never be done when the content can be identified properly, as once identification is lost, it is extremely difficult (and context dependent) to restore it again.
     */
    contained?: FhirResource[];
    //contained?: FhirResource[];
    extension?: Extension[];
    modifierExtension?: Extension[];
    text?: Narrative;
}


/**
 * Base definition for all elements in a resource.
 */
export interface Element {
    extension?: Extension[];
    id?: string;
}

/**
 * Optional Extension Element - found in all resources.
 */
export interface Extension extends Element {
    url: string;
    valueBase64Binary?: string;
    valueBoolean?: boolean;
    valueCode?: string;
    valueDate?: Date; // | string;
    valueDateTime?: Date; // string > Date
    valueDecimal?: number;
    //valueId?: string;
    valueInstant?: Date; // string > Date
    valueInteger?: number;
    //valueMarkdown?: string;
    //valueOid?: string;
    //valuePositiveInt?: number;
    valueString?: string;
    //valueTime?: string;
    valueUnsignedInt?: number;
    valueUri?: string;
    valueAddress?: Address;
    //valueAge?: Age;
    valueAnnotation?: Annotation;
    valueAttachment?: Attachment;
    valueCodeableConcept?: CodeableConcept;
    valueCoding?: Coding;
    valueContactPoint?: ContactPoint;
    //valueCount?: Count;
    //valueDistance?: Distance;
    //valueDuration?: Duration;
    valueHumanName?: HumanName;
    valueIdentifier?: Identifier;
    //valueMoney?: Money;
    valuePeriod?: Period;
    valueQuantity?: Quantity;
    valueRange?: Range;
    valueRatio?: Ratio;
    valueReference?: Reference;
    //valueSampledData?: SampledData;
    //valueSignature?: Signature;
    //valueTiming?: Timing;
    valueSchedule?: Timing;
    //valueMeta?: Meta;
}


export interface Resource {
    readonly resourceType: string;
    id?: string;
    implicitRules?: string;
    language?: string;
    meta?: Meta;
}

/**
 * The metadata about a resource. This is content in the resource that is maintained by the infrastructure. Changes to the content may not always be associated with version changes to the resource.
 */
export interface Meta extends Element {
    lastUpdated?: Date; // string > Date
    profile?: string[];
    security?: Coding[];
    tag?: Coding[];
    versionId?: string;
}

/**
 * An address expressed using postal conventions (as opposed to GPS or other location definition formats).  This data type may be used to convey addresses for use in delivering mail as well as for visiting locations which might not be valid for mail delivery.  There are a variety of postal address formats defined around the world.
 */
export interface Address extends Element {
    readonly resourceType: 'Address';
    city?: string;
    country?: string;
    district?: string;
    line?: string[];
    period?: Period;
    postalCode?: string;
    state?: string;
    text?: string;
    type?: ('postal' | 'physical' | 'both');
    use?: ('home' | 'work' | 'temp' | 'old');
}

/**
 * A time period defined by a start and end date and optionally time.
 */
export interface Period extends Element {
    end?: string;
    start?: string;
}

/**
 * A reference to a code defined by a terminology system.
 */
export interface Coding extends Element {
    code?: string;
    display?: string;
    system?: string;
    userSelected?: boolean;
    version?: string;
}

/**
 * Specifies an event that may occur multiple times. Timing schedules are used to record when things are planned, expected or requested to occur. The most common usage is in dosage instructions for medications. They are also used when planning care of various kinds, and may be used for reporting the schedule to which past regular activities were carried out.
 */
export interface Timing extends Element {

    code?: CodeableConcept;
    event?: string[];
    _event?: Element[];
    repeat?: TimingRepeat;
}

/**
 * A concept that may be defined by a formal reference to a terminology or ontology or may be provided by text.
 */
export interface CodeableConcept extends Element {
    coding?: Coding[];
    text?: string;
}

/**
 * A set of rules that describe when the event is scheduled.
 */
export interface TimingRepeat extends Element {
    boundsDuration?: Duration;
    boundsRange?: Range;
    boundsPeriod?: Period;
    count?: number;
    countMax?: number;
    dayOfWeek?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
    duration?: number;
    durationMax?: number;
    durationUnit?: ('s' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a');
    frequency?: number;
    frequencyMax?: number;
    offset?: number;
    period?: number;
    periodMax?: number;
    periodUnit?: ('s' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a');
    timeOfDay?: string[];
    when?: string[];
}

/**
 * A measured amount (or an amount that can potentially be measured). Note that measured amounts include amounts that are not precisely quantified, including amounts involving arbitrary units and floating currencies.
 */
export interface Quantity extends Element {
    code?: string;
    comparator?: ('<' | '<=' | '>=' | '>');
    system?: string;
    unit?: string;
    value?: number;
}

export type Duration = Quantity

/**
 * For referring to data content defined in other formats.
 */
export interface Attachment extends Element {
    contentType?: string;
    //creation?: string;
    //data?: string;
    //hash?: string;
    //language?: string;
    //size?: number;
    title?: string;
    url?: string;
}

/**
 * Details for all kinds of technology mediated contact points for a person or organization, including telephone, email, etc.
 */
export interface ContactPoint extends Element {
    readonly resourceType: 'ContactPoint';
    period?: Period;
    rank?: number;
    system?: ('phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other');
    use?: ('home' | 'work' | 'temp' | 'old' | 'mobile');
    value?: string;
}

export interface HumanName extends Element {
    readonly resourceType: 'HumanName';
    family?: string;
    given?: string[];
    period?: Period;
    prefix?: string[];
    suffix?: string[];
    text?: string;
    use?: ('usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden');
}

/**
 * A technical identifier - identifies some entity uniquely and unambiguously.
 */
export interface Identifier extends Element {
    assigner?: Reference;
    period?: Period;
    system?: string;
    type?: CodeableConcept;
    use?: ('usual' | 'official' | 'temp' | 'secondary');
    value?: string;
}

/**
 * A reference from one resource to another.
 */
export interface Reference extends Element {
    display?: string;
    identifier?: Identifier;
    reference?: string;
}

/**
 * A set of ordered Quantities defined by a low and high limit.
 */
export interface Range extends Element {
    high?: Quantity;
    low?: Quantity;
}

/**
 * A relationship of two Quantity values - expressed as a numerator and a denominator.
 */
export interface Ratio extends Element {
    denominator?: Quantity;
    numerator?: Quantity;
}

/**
 * A human-readable formatted text, including images.
 */
export interface Narrative extends Element {
    div: string;
    status: ('generated' | 'extensions' | 'additional' | 'empty');
}

/**
 * Base definition for all elements that are defined inside a resource - but not those in a data type.
 */
export interface BackboneElement extends Element {
    modifierExtension?: Extension[];
}

/**
 * A  text note which also  contains information about who made the statement and when.
 */
export interface Annotation extends Element {
    authorReference?: Reference;
    authorString?: string;
    text: string;
    time?: string;
}

/**
 * A digital signature along with supporting context. The signature may be electronic/cryptographic in nature, or a graphical image representing a hand-written signature, or a signature process. Different signature approaches have different utilities.
 */
export interface Signature extends Element {
    blob?: string;
    contentType?: string;
    onBehalfOfUri?: string;
    onBehalfOfReference?: Reference;
    type: Coding[];
    when: string;
    whoUri?: string;
    whoReference?: Reference;
}

/**
 * A series of measurements taken by a device, with upper and lower limits. There may be more than one dimension in the data.
 */
export interface SampledData extends Element {
    data: string;
    dimensions: number;
    factor?: number;
    lowerLimit?: number;
    origin: Quantity;
    period: number;
    upperLimit?: number;
}

/**
 * An error, warning or information message that results from a system action.
 */
export interface OperationOutcomeIssue extends BackboneElement {
    code: string;
    details?: CodeableConcept;
    diagnostics?: string;
    expression?: string[];
    location?: string[];
    severity: ('fatal' | 'error' | 'warning' | 'information');
}
/**
 * A collection of error, warning or information messages that result from a system action.
 */
export interface OperationOutcome extends DomainResource {
    readonly resourceType: 'OperationOutcome';
    issue: OperationOutcomeIssue[];
}

/**
 * Clase que modela el tipo AuditEvent de FHIR
 */
export interface AuditEventAppRS extends DomainResource {
    id?:string;
    subtype: Coding[];
    action: string;
    entityReference: string;
    entityQuery: string;
}


