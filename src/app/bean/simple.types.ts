import { Prescription } from './models/prescription';

export type DisplayItem = {
    code?: string;
    display?: string;
}

export type BasicItem = {
    code?: string;
    description: string;
}
export type SecureBasicItem = {
    code: string;
    description: string;
}

export type SecureDisplayItem = {
    code: string;
    display: string;
}

export type TextItem = {
    code?: string;
    text?: string;
}

export type RequiredDisplayItem = DisplayItem & {
    required: boolean;
}

export type Constant = {
    code: string;
    description: string;
    value: string;
}

export type BlockMotive = DisplayItem;

export type Justification = {
    code: string;
    description: string;
    remarks: string;
    state: boolean;
}

export type Month = {
    code: number;
    description: string;
};

export type Province = SecureBasicItem;
export type ProfesionalType = BasicItem;
export type EstablishmentType = BasicItem;
export type ProductType = BasicItem;
export type BillingType = SecureBasicItem;

export type BlockEvent = {
    prescription: Prescription;
    motive: BlockMotive;
    observation?: string;
}

export type HistoricFilter = {
    startYear: number;
    endYear: number;
    state?: DisplayItem | null;
    prescriptionDate?: Date;
    dispensationDate?: Date;
}

export type DispensingCenter = {
    code: string;
    display: string;
}

export type BasicCode = {
    code: string;
}

export type PaginationState = {
    first: number,
    rows: number,
    page: number,
    pageCount: number,
};

export type ActivePasiveType = {

    code: string,
    description: string

};

export type WacomStateType = {

    code: string,
    description: string,
    value: string

}