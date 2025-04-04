import { Observable } from "rxjs";
import { Bundle, BundleEntry } from "../../../bean/fhir-r3/domain/interfaces/bundle.interface";
import { FhirResource } from "../../../bean/fhir-r3/domain/interfaces/common.interface";

export interface AtnaDao {

    create(url: string, data: any): Observable<any>; 
}