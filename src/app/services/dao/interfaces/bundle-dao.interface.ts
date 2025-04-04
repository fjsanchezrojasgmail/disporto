import { Observable } from "rxjs";
import { BundleEntry } from "../../../bean/fhir-r3/domain/interfaces/bundle.interface";
import { FhirResource } from "../../../bean/fhir-r3/domain/interfaces/common.interface";

export interface BundleDao {

  updateResource(data: BundleEntry<FhirResource>[], url?: string): Observable<any>;
}
