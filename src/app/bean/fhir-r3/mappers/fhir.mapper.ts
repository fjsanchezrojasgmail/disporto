import { CodeableConcept, Coding, Identifier, OperationOutcome } from '../domain/interfaces/common.interface';
import { SimpleError } from '../../../services/http.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FhirTypes } from '../fhir-constants';

export const mapIdentifier = (value: string, attr?: { system?: string, text?: string }): Identifier => {
    const identifier: Identifier = {};
    identifier.value = value;
    identifier.system = attr?.system;
    if (attr?.text) identifier.type = mapCodeableConcept(attr.text);
    return identifier;
};

export const mapCodeableConcept = (text: string, attr?: { coding?: Coding[] }): CodeableConcept => {
    const codeable: CodeableConcept = {};
    codeable.coding = attr?.coding;
    codeable.text = text;
    return codeable;
};

export const mapFhirHttpError = (errorResp: HttpErrorResponse): SimpleError[] | undefined => {
    if (errorResp.error && errorResp.error.resourceType) {
        switch (errorResp.error.resourceType) {
            case FhirTypes.OPERATION_OUTCOME:
                return (errorResp.error as OperationOutcome).issue.map(o => <SimpleError>{
                    title: o.code,
                    message: o.diagnostics,
                    severity: mapSeverity(o.severity)
                });
            default:
                break;
        }
    }
    return undefined;
};

const mapSeverity = (severity: string): string => {
    switch (severity) {
        case 'fatal':
        case 'error':
            return 'error';
        case 'warning':
            return 'warn';
        case 'information':
            return 'info';
        default:
            return 'success';
    }
};


