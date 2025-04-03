import { BillingType, DisplayItem, Month, Province } from '../simple.types';

export type EstablishmentBillingRow = {
    id: string;
    check: boolean;
    selectable: boolean;
    selectableDispensation: boolean;
    expanded: boolean;
    billing: EstablishmentBilling; //| ProvinceBilling;
}

export interface EstablishmentBilling {
    code?: string;
    codeFactura?: string;
    name?: string; // codeFactura
    month: number; // actual
    year: number; // actual
    codeTipoFactura: string; // ass, col, ind
    codeCenter: string;
    descriptionCenter: string;
    codeRegion: string;
    descriptionRegion: string;
    totalFacturar: number;
    totalAportacion: number;
    totalGasto: number;
    totalPrescripciones: number;
    totalProductos: number;
    totalFacturarQ: number;
    totalAportacionQ: number;
    totalGastoQ: number;
    totalPrescripcionesQ: number;
    totalProductosQ: number;
    totalFacturarP: number;
    totalAportacionP: number;
    totalGastoP: number;
    totalPrescripcionesP: number;
    totalProductosP: number;
    dateTo?: string;
    dni: string;
    estadoFacturacion: string; // depende del centro
    codeFacturacionProvincial?: string;
}

export type BillingStatePairs = EstablishmentBillingStatePair | ProvinceBillingStatePair;

type EstablishmentBillingStatePair = {
    codeFactura: string;
    estadoFacturacion: string;
}
type ProvinceBillingStatePair = {
    codeFacturacionProvincial: string;
    estadoFacturacion: string;
}

export interface ProvinceBilling {
    code?: string;
    codeFactura: string;
    month: number;
    year: number;
    codeTipoFactura: string;
    codeRegion: string;
    descriptionRegion: string;
    totalFacturar: number;
    totalAportacion: number;
    totalGasto: number;
    totalPrescripciones: number;
    totalProductos: number;
    totalFacturarQ: number;
    totalAportacionQ: number;
    totalGastoQ: number;
    totalPrescripcionesQ: number;
    totalProductosQ: number;
    totalFacturarP: number;
    totalAportacionP: number;
    totalGastoP: number;
    totalPrescripcionesP: number;
    totalProductosP: number;
    totalFacturacionRegularizacion?: number;
    totalFactRegularizacionQ?: number;
    totalFactRegularizacionP?: number;
    totalGastoRegularizacion?: number;
    totalGastoRegQ?: number;
    totalGastoRegP?: number;
    totalGastoRegTotal?: number;
    dateTo?: string;
    dni?: string;
    estadoFacturacion?: string;
}

export interface ProvinceBillingCreate extends ProvinceBilling {
    codFacturasCentros: string[];
}

export type BillingResponse = {
    code: number,
    msg: number,
}

export type BillingFilter = {
    code?: string,
    type: DisplayItem | null,
    state: DisplayItem | null,
}

export type BillingGeneralFilter = {
    month: Month;
    year: Date;
    billingType: BillingType | null;
    province: Province | null;
    code?: string;
    flag?: boolean;
}

export type BillingApiFilter = {
    codeCenter?: string;
    codeRegion?: string;
    codeTipoFactura?: string;
    month?: number;
    year?: number;
    flagDatos?: boolean;
}

export type BillingEstablishmentMasterFilter = {
    codProvincia?: string;
}

export type EstablishmentFilter = {
    centerName?: string;
    codeRegion?: string;
    code?: string;
    dni?: string;
}

export type EstablishmentMaster = {
    code: string,
    centerName: string,
    cif: string,
    cof: string,
    address: string,
    direccion: string,
    postalCode: string,
    codProvincia: string,
}

export type ProfessionalFilter = {

    code?: string;
    name?: string;
    surname1?: string;
    surname2?: string;
    dni?: string;
    typeProfesional?: string;
    state?: boolean;
    titular?: string;
    permissionFac?: string;

}

export type Management = {
    code: string,
    gerencia: string,
    cif: string,
    direccion: string,
    postalCode: string,
    codProvincia: string,
    descripcionProvincia: string
}

export type Titular = {
    code: string,
    typeStablishment: string,
    typeProduct: string,
    centerName: string,
    cif: string,
    codeRegion: string,
    descriptionRegion: string,
    phone: string,
    address: string,
    codeFact: string,
    profesionalName: string,
    apellido1: string,
    apellido2: string,
    dni: string
}