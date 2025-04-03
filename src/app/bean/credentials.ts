
export interface TokenInfo {
    access_token?: string;
    expires_in?: string;
    display?: string;
    hcProfessionCode?: string;
    hcProfessionName?: string;
    hcSpecialtyCode?: string;
    hcSpecialtyName?: string;
    scope: string;
    id_token?: string;
    patient?: string;
    refresh_expires_in?: string;
    refresh_token?: string;
    session_state?: string;
    smart_style_url?: string;
    token_type?: string;
    hnrole: HnRole;
    datos_login: LoginData;
}

export interface LoginData {
    apellido2: string;
    apellido1: string;
    telefono: string;
    nombre: string;
    dni: string;
}

export interface RealmAccess {
    roles: string[];
}

export interface HnRole {
    code: string;
    tipoRol: string;
    display: string;
    scope: string;
    permisoFact: string;
    titular: string;
}