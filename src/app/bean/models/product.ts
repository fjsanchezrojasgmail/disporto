import { DeviceRequest } from '../fhir-r3/domain/interfaces/device-request.interface';
import { Device } from '../fhir-r3/domain/interfaces/device.interface';
import { FhirValue } from '../fhir-r3/fhir-constants';
import { FhirDeviceRequestUrl, FhirDeviceUrl } from '../fhir-r3/fhir-url-constants';
import { DisplayItem } from '../simple.types';

export interface Product {
    id: string;
    request: string;
    code: string;
    description: string;
    type: DisplayItem;
    group: DisplayItem;
    imf: ImfDefinition;
    units: UnitsDefinition;
    justification?: string;
    observation?: string;
    observations?: string[];
    pvp: PvPDefinition;
    improvable: ImprovableDefinition;
    reimbursement: boolean;
    reducedVat: boolean;
    replaceable?: boolean;
    eyes: boolean,
    headset: boolean,
    elaboration?: string,
    brand?: Brand;
    userConsideration: AportationDefinition;
    laterality?: LateralityDefinition;
    pulledApart: DisplayItem;

    //logica interna, se considera el producto para el calculo de la prescripcion
    consider?: boolean;
    prescriptionBrand?: boolean;
}

export type UnitsDefinition = {
    value: number;
    originalValue: number;
}

export type Brand = {
    code: string;
    product?: string;
    description: string;
    pvp?: number;
};

export type PvPDefinition = {
    value?: number;
    valueTax?: number;
    tax?: number;
    total?: number;
}

export type ImprovableDefinition = {
    condition: boolean;
    text?: number;
}

export type ImfDefinition = {
    imfNoTax?: number;
    imfWithTax?: number;
    maxImf?: number;
    modifiableImf: boolean;
}

export type AportationDefinition = {
    aportation?: number;
    realAportation?: number;

}

export type LateralityDefinition = {
    apply?: string;
    bodysite?: string;
};

export interface ProductType {
    code: string;
    text: string;
}

export interface ProductGroup {
    code: string;
    text: string;
}

export interface ProductSubGroup {
    code: string;
    text: string;
    laterality: string;
    iva: string;
    udsProd: string;
}

export const mapFhirToProduct = (deviceRequest?: DeviceRequest, device?: Device): Product => {
    const observastions = [
        device?.extension?.find(e => e.url === FhirDeviceUrl.REMARKS)?.valueString
    ];
    const quantity = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.QUANTITY)?.valueString;
    const quantityDispensed = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.QUANTITY_DISPENSED)?.valueString;
    const bodysite = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.BODYSITE)?.valueString;
    const justification = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.JUSTIFICATION)?.valueCodeableConcept?.text;
    const price = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.PRICE)?.valueString;
    const priceTax = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.TAX_PRICE)?.valueString;
    const realAportation = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.REAL_APORTATION)?.valueString;
    const tax = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.TAX)?.valueString;
    const total = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.FULL_PRICE)?.valueString;
    const dispensedBrand = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.DISPENSED_BRAND)?.valueCoding;
    const improvable = deviceRequest?.extension?.find(e => e.url === FhirDeviceRequestUrl.IMPROVABLE)?.valueCodeableConcept;

    const aportation = device?.extension?.find(e => e.url === FhirDeviceUrl.USER_CONTRIBUTION)?.valueString?.replace(',', '.');
    const amount = device?.extension?.find(e => e.url === FhirDeviceUrl.AMOUNT)?.valueString?.replace(',', '.');
    const modifiableAmount = device?.extension?.find(e => e.url === FhirDeviceUrl.MODIFIABLE_AMOUNT)?.valueString;
    const replaceable = device?.extension?.find(e => e.url === FhirDeviceUrl.REPLACEABLE)?.valueString === FhirValue.YES;
    const imf = device?.extension?.find(e => e.url === FhirDeviceUrl.IMF)?.valueCoding?.display?.replace(',', '.');
    const maxImf = device?.extension?.find(e => e.url === FhirDeviceUrl.MAXIMUM_MODIFIABLE_IMF)?.valueString?.replace(',', '.');
    const eyes = device?.extension?.find(e => e.url === FhirDeviceUrl.EYES)?.valueString === FhirValue.YES;
    const headset = device?.extension?.find(e => e.url === FhirDeviceUrl.HEADSET)?.valueString === FhirValue.YES;
    const group = device?.extension?.find(e => e.url === FhirDeviceUrl.DEVICE_GROUP)?.valueCoding;
    const brand = device?.extension?.find(e => e.url === FhirDeviceUrl.COMERCIAL_BRAND)?.valueCoding;
    const pulledApart = device?.extension?.find(e => e.url === FhirDeviceUrl.PULLED_APART)?.valueCoding;
    return <Product>{
        id: device?.id || '',
        request: deviceRequest?.id || '',
        code: device?.model || '',
        description: device?.manufacturer || '',
        justification: justification,
        observation: device?.extension?.find(e => e.url === FhirDeviceUrl.REMARKS)?.valueString,
        observations: observastions.map(e => (e) ? e : '').filter(e => e !== '') || undefined,
        userConsideration: {
            aportation: aportation ? Number(aportation) : undefined,
            realAportation: realAportation ? Number(realAportation) : undefined
        },
        reimbursement: device?.extension?.find(e => e.url === FhirDeviceUrl.EXPENSE_REIMBURSEMENT)?.valueString === FhirValue.YES,
        reducedVat: device?.extension?.find(e => e.url === FhirDeviceUrl.REDUCED_VAT)?.valueString === FhirValue.YES,
        laterality: {
            apply: device?.extension?.find(e => e.url === FhirDeviceUrl.LATERALITY)?.valueString,
            bodysite: bodysite
        },
        replaceable: replaceable,
        brand: (dispensedBrand) ?
            {
                code: dispensedBrand?.code,
                description: dispensedBrand?.display
            } :
            (brand) ?
                {
                    code: brand?.code,
                    description: brand?.display
                } :
                undefined,
        prescriptionBrand: brand !== undefined,
        units: {
            value: quantityDispensed ?
                Number(quantityDispensed) :
                quantity ?
                    Number(quantity) : 1,
            originalValue: quantity ? Number(quantity) : 1
        },
        imf: {
            imfNoTax: amount ? Number(amount) : undefined,
            imfWithTax: imf ? Number(imf) : undefined,
            modifiableImf: modifiableAmount === FhirValue.YES || modifiableAmount === undefined,
            maxImf: maxImf ? Number(maxImf) : undefined
        },
        pvp: {
            value: price ? Number(price) : undefined,
            valueTax: priceTax ? Number(priceTax) : undefined,
            tax: tax ? Number(tax) : undefined,
            total: total ? Number(total) : undefined
        },
        group: {
            code: group?.code,
            display: group?.display
        },
        type: {
            code: device?.type?.coding?.at(0)?.code,
            display: device?.type?.text
        },
        improvable: {
            condition: improvable?.coding?.at(0)?.code === FhirValue.YES,
            text: improvable?.text
        },
        eyes,
        pulledApart,
        headset,
        elaboration: device?.extension?.find(e => e.url === FhirDeviceUrl.TYPE_ELABORATION)?.valueString
    };
};