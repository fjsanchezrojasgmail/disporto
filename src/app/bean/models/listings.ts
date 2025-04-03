import { Province, SecureBasicItem } from '../simple.types';

export type FilterGeneric = {
    startDate: Date;
    endDate: Date;
    province: Province;
    state: SecureBasicItem;
}
export type FilterPrescriptor = FilterGeneric & {
    prescriptor: string;   
}
export type FilterDispensingCenter = FilterGeneric & {
    dispensingCenter: string;   
}
export type FilterPatient = FilterGeneric & {
    patient: string;   
}
export interface ReportCriteria{
    fechaInicio: string;
    fechaFin: string;
    gerencia: string;
    estado: string;
    prescriptor?: string;
    establecimiento?: string;
    paciente?: string;
}

export interface OrtoReport{
    codigo: string;
    descripcion: string;
    rg: string;
    numeroProductos: number;
    importe: number;
    aportacion: number;
    gastoFinal: number;
    tipo: string;
    cif: string;
    denominacion: string;
    cpf: string;
    nombre: string;
    apellidos: string;
}