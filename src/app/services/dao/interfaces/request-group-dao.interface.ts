import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { BundleModel } from "../../../bean/fhir-r3/domain/bundle";

export interface RequestGroupDao {

  search(criteria: HttpParams, url?: string): Observable<BundleModel | null>;
        
}
