import { TextItem } from '../simple.types';

export interface SimplePatient {
    id: string;
    name?: string;
    surnames?: string;
    fullname?: string;
    gender?: string;
    birthDate?: Date | string;
    dni?: string;
    cipa?: string;
    codSNS?: string;
    passport?: string;
    situation?: TextItem;
    pharmacyIndicator?: TextItem;
    disability: number;
}

export const dummyPatient: SimplePatient = {
    id: '68768787687687867',
    name: 'Un',
    surnames: 'Asco Creta',
    birthDate: new Date('1985-01-16'),
    cipa: '4785112368',
    gender: 'M',
    disability: 0
};

export type SearchPatientFilter = {
    cipa?: string;
    barcode?: string;
}