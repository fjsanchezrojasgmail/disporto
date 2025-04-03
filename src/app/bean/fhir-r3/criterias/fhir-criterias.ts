import { HttpParams } from "@angular/common/http";

export type FhirCriteria = HttpParams;

export const versionBundleCriteria = (id: string) : HttpParams => {
    const result : HttpParams = new HttpParams()
        .append('identifier', id);
    return result;
}

export const findPatientByBarcode = (barcode: string) : HttpParams => {
    const result : HttpParams = new HttpParams()
        .append('x-orto-barcode', barcode);
    return result;
}
