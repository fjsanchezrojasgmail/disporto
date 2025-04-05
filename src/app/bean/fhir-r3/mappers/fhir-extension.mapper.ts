import { FhirDeviceRequestUrl, FhirDeviceUrl, FhirPatienUrl, FhirRequestGroupUrl, FhirUrlExtensions } from '../fhir-url-constants';
import { CodeableConcept, Coding, Extension, Identifier } from '../domain/interfaces/common.interface';

const codeableConceptUrl: FhirUrlExtensions[] = [
    FhirPatienUrl.BASIC_HEALTH_AREA,
    FhirPatienUrl.BIRTHCOUNTRY,
    FhirPatienUrl.PHARMACY_INDICATOR,
    FhirPatienUrl.SITUATION,
    FhirRequestGroupUrl.PRECAUTIONARY_BLOCKING
];

const valueCodingUrl: FhirUrlExtensions[] = [
    FhirRequestGroupUrl.PRESCRIPTION_STATUS,
    FhirRequestGroupUrl.DISPENSING_CENTER,
    FhirDeviceRequestUrl.DISPENSED_BRAND
];

const valueDateUrl: FhirUrlExtensions[] = [
    FhirRequestGroupUrl.DISPENSATION_DATE,
    FhirRequestGroupUrl.VALIDITY_DATE
];

const extensionUrl: FhirUrlExtensions[] = [
    FhirPatienUrl.NATIONALITY
];

export type ExtensionElement = Extension | CodeableConcept | Identifier | string | undefined;

export const createOrModifyExtension = (
    extensions: Extension[] | undefined,
    url: FhirUrlExtensions,
    value: Partial<CodeableConcept | Coding | Extension | Date | string | undefined>): Extension[] | undefined => {

    const result = extensions?.map(elem => {
        if (codeableConceptUrl.includes(url) && elem.url === url && elem.valueCodeableConcept) {
            return { ...elem, valueCodeableConcept: { ...elem.valueCodeableConcept, ...(value as CodeableConcept) } };
        }
        else if (valueCodingUrl.includes(url) && elem.url === url && elem.valueCoding) {
            return { ...elem, valueCoding: { ...elem.valueCoding, ...(value as Coding) } };
        }
        else if (valueDateUrl.includes(url) && elem.url === url) {
            return { url, valueDate: value as Date };
        }
        else if (elem.url === url) {
            return { url, valueString: value as string };
        }
        return elem;
    });
    if (!result?.find(e => e.url === url)) {
        if (codeableConceptUrl.includes(url)) {
            result?.push({ url, valueCodeableConcept: value as CodeableConcept });
        }
        else if (valueCodingUrl.includes(url)) {
            result?.push({ url, valueCoding: { userSelected: false, ...value as Coding } });
        }
        else if (valueDateUrl.includes(url)) {
            result?.push({ url, valueDate: value as Date });
        }
        else {
            result?.push({ url, valueString: value as string });
        }
    }
    return result;
};