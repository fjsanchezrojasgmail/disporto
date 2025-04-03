import { BillingActions } from '../constants';
import { Practitioner } from '../fhir-r3/domain/interfaces/practitioner.interface';
import { FhirIdentifierSystem } from '../fhir-r3/fhir-url-constants';
import { Province } from '../simple.types';
import { Establishment } from './administration';


export interface ProfesionalAdm {
    code?: string;
    name: string;
    surname1: string;
    surname2: string;
    dni: string;
    phone: string;
    state?: boolean,
    dateTo?: string;
    typeProfesional: string;
    titular: string;
    permissionFac: string;
    listEstablecimientos: Establishment[];
    provinces: Province[];
}

export interface SimpleProfesional {
    name: string;
    dni: string;
    collegiateNumber: string;
}

export const mapFhirToProfesional = (pract: Practitioner): SimpleProfesional => {
    return {
        name: pract.name?.at(0)?.text || '',
        dni: pract.identifier?.find(i => i.system === FhirIdentifierSystem.DNI)?.value || '',
        collegiateNumber: pract.identifier?.find(i => i.system === FhirIdentifierSystem.COLLEGIATE_NUMBER)?.value || ''
    };
};

export interface Center {
    id: string;
    desc: string;
}

export interface ProfesionalActions {
    globalActions?: BillingActions[],
    individualActions?: BillingActions[]
}

export interface Unit {
    id: string;
    desc: string;
}

export declare enum HNSessionUserScope {
    NA = 0,
    SYSTEM = 1,
    ORGANIZATION = 2,
    CENTER = 3,
    UNIT = 4,
}
export declare class HNSessionUserDataRS {
    id: string;
    login: string;
    userName: string;
    accessOptions: AccessOption;
    role: PropertyUser;
    center: PropertyUser;
    organization: PropertyUser;
    careLine: PropertyUser;
    unit: PropertyUser;
    scope: HNSessionUserScope;
    hnrole: PropertyUser;
    idPatientLogged: string;
    aud: string;
    permissions: Array<string>;
    hasStandaloneHeader: boolean;
    birthday: string;
    gender: string;
    lastConnection: string;
}
export declare class AccessOption {
    id: string;
    code: string;
    urlVuelta: string;
}
export declare class PropertyUser {
    code: string;
    display: string;
    alias: string;
    scope: string;
    hcProfessionCode: string;
    hcProfessionName: string;
    hcSpecialtyCode: string;
    hcSpecialtyName: string;
}
