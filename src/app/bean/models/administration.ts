import { AdminStatus, RegularisationBalanceCodes, RegularisationClassificationCodes, RegularisationStates } from '../constants';
import { FhirTypes } from '../fhir-r3/fhir-constants';
import { BillingType, Province } from '../simple.types';



export interface Regularisation {
    id?: string;
    code: string;
    description: string;
    province: Province;
    billingType: BillingType;
    establishmentCode?: string;
    quantity: number;
    balance: RegularisationBalanceCodes;
    pasiveDate?: Date;
    status: AdminStatus; // Estado que pedende de si pasiveDate esta definido o no
    registrationDate?: Date;
    provincialBillingCode?: string;
    establishmentBillingCode?: string;
    classification: RegularisationClassificationCodes;
    state: RegularisationStates;
}

export type Balance = {
    code: RegularisationBalanceCodes,
    description: string
};

export type Classification = {
    code: RegularisationClassificationCodes;
    description: string;
}

export interface RegularisationAdm {
    code?: string;
    regCode: string;
    description: string;
    cantidad: number,
    incrementoDecremento: string;
    tipoFacturacionCode: string;
    codeProvincia: string;
    descripcionProvincia: string;
    codeCentro?: string;
    fechaRegistro?: string;
    dateTo?: string;
    facturacionEstablecimientoCode?: string;
    estadoRegularizacion: string;
    facturacionProvincialCode?: string;
    clasificacion?: string;
}

export interface RegularisationAssociation {
    codFacturaEstablecimiento?: string;
    codFacturacionProvincial?: string;
    fechaRegistro?: string;
    listCodRegularizaciones?: string[];
}

export type RegularisationCodes = {
    facturacionProvincialCode?: string,
    facturacionEstablecimientoCode?: string,
}

export interface Establishment {
    code: string;
    cif: string;
    typeStablishment: string;
    typeProduct: string;
    centerName: string;
    codeRegion: string;
    descriptionRegion: string;
    phone: string;
    address: string;
    codeFact: string;
    dateTo?: string;
}

export interface EstablishmentAdm {
    code: string;
    cif: string;
    typeStablishment: string;
    typeProduct: string;
    centerName: string;
    codeRegion: string;
    descriptionRegion: string;
    phone: string;
    address: string;
    codeFact: string;
    dateTo?: string;
}

export interface EstablishmentType {
    code: string;
    description: string;
}

export interface EstablishmentBillingType {
    code: string;
    description: string;
    email: string;
}

export class ProfessionalType {
    code?: string;
    description?: string;
}

export interface DocumentId {
    idDocument: string;
}

export interface PayLoadCustody {

    idResource: string[],
    typeResource: FhirTypes,
    fileName: string,
    document: string

}