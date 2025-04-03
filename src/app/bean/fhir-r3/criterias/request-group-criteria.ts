import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { MaxPageSize, PrescriptionState } from '../../constants';
import { HistoricFilter } from '../../simple.types';
import { FhirValue } from '../fhir-constants';


export const defaultRGCriteria = (pageSize?: string): HttpParams => {
    const result: HttpParams = new HttpParams()
        .append('_include', 'RequestGroup:subject')
        .append('_include', 'RequestGroup:context')
        .append('_include', 'RequestGroup:author')
        .append('_include', 'RequestGroup:x-resource')
        .append('_include:recurse', 'DeviceRequest:device')
        .append('_include:recurse', 'Encounter:service-provider')
        .append('_include:recurse', 'Organization:partof')
        .append('_tag', 'mymed.app.source|hnanexo')
        .append('_count', pageSize || MaxPageSize.toString())
        .append('status', 'active');
    return result;
};

export const criteriaRGHistoric = (patientId: string): HttpParams => {
    const result = defaultRGCriteria()
        .append('subject', patientId)
        .append('x-prescriptionStatus', Object.values(PrescriptionState).join(','));
    return result;
};

export const criteriaRGHistoricWithFilter = (patientId: string, filter: HistoricFilter): HttpParams => {
    let result = defaultRGCriteria()
        .append('subject', patientId)
        .append('authored', 'ge' + filter.startYear.toString() + '-01-01T00:00:00')
        .append('authored', 'le' + filter.endYear.toString() + '-12-31T23:59:59');

    if (filter.state?.code) result = result.append('x-prescriptionStatus', filter.state.code);
    else {
        result = result.append('x-prescriptionStatus', [
            PrescriptionState.PRESC_PDTE_VALIDACION,
            PrescriptionState.PRESC_PDTE_NUEVAVALIDACION,
            PrescriptionState.ANULADA,
            PrescriptionState.PRESC_PDTE_DISPENSAR,
            PrescriptionState.PRESC_PDTE_VISTO_BUENO,
            PrescriptionState.PRESC_NO_SACYL,
            PrescriptionState.PRESC_DENEGADO_VISTO_BUENO,
            PrescriptionState.PRESC_RESERVADA,
            PrescriptionState.PRESC_DISPENSADA,
            PrescriptionState.PRESC_BLOQUEO_CAUTELAR,
            PrescriptionState.ANULADA_BLOQUEO_CAUTELAR
        ].join(','));
    }

    if (filter.prescriptionDate)
        result = result.append('authored', 'eq' + formatDate(filter.prescriptionDate, 'yyyy-MM-dd', 'es'));
    if (filter.dispensationDate)
        result = result.append('x-dispensationDate', 'eq' + formatDate(filter.dispensationDate, 'yyyy-MM-dd', 'es'));

    return result;
};

export const criteriaRGDispensableProducts = (patientId: string, pageSize: string): HttpParams => {
    const result: HttpParams = defaultRGCriteria(pageSize)
        .append('subject', patientId)
        .append('x-prescriptionStatus', [
            PrescriptionState.PRESC_PDTE_DISPENSAR,
            PrescriptionState.PRESC_RESERVADA,
            PrescriptionState.PRESC_PDTE_VALIDACION,
            PrescriptionState.PRESC_PDTE_NUEVAVALIDACION,
            PrescriptionState.PRESC_BLOQUEO_CAUTELAR,
            PrescriptionState.PRESC_PDTE_VISTO_BUENO,
            PrescriptionState.PRESC_NO_SACYL
        ].join(','));
    return result;
};

export const criteriaRGModifications = (patientId: string, center: string, date: Date): HttpParams => {
    //TODO: AÑADIR FILTRO POR CENTRO Y POR FECHA
    const result: HttpParams = defaultRGCriteria()
        .append('subject', patientId)
        .append('status', 'active')
        .append('x-orto-dispensingCenter', center)
        .append('x-prescriptionStatus', [
            PrescriptionState.PRESC_DISPENSADA,
            PrescriptionState.PRESC_PDTE_VALIDACION,
            PrescriptionState.PRESC_PDTE_NUEVAVALIDACION,
            PrescriptionState.PRESC_RESERVADA,
            PrescriptionState.PRESC_BLOQUEO_CAUTELAR
        ].join(','));
    return result;
};

export const criteriaRGBillingByCenter = (center: string, endDate: Date | undefined, billingCode: string | undefined): HttpParams => {
    let result: HttpParams = defaultRGCriteria()
        .append('status', 'active')
        .append('x-orto-parecylBilling', FhirValue.YES)
        .append('x-orto-dispensingCenter', center)
        .append('x-prescriptionStatus', [
            PrescriptionState.PRESC_DISPENSADA
        ].join(','));
    if (billingCode) result = result.append('x-orto-establishmentBilling', billingCode);
    else result = result.append('x-orto-establishmentBilling:missing', true);
    if (endDate) result = result.append('x-dispensationDate', 'le' + formatDate(endDate, 'yyyy-MM-ddTHH:mm:ss', 'es'));

    return result;
}; 