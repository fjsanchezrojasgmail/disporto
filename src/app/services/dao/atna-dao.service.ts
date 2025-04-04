import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { versionBundleCriteria } from '../../bean/fhir-r3/criterias/fhir-criterias';
import { BundleModel } from '../../bean/fhir-r3/domain/bundle';
import { Bundle, BundleEntry } from '../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { FhirResource } from '../../bean/fhir-r3/domain/interfaces/common.interface';
import { FhirTypes } from '../../bean/fhir-r3/fhir-constants';
import { HttpService } from '../http.service';
import { BundleDao } from './interfaces/bundle-dao.interface';
import { ConfigService } from '../config.service';
import { RequestGroup } from 'fhir/r3';
import { AtnaDao } from './interfaces/atna-dao.interface';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class AtnaDaoService implements AtnaDao {

  private path_audit = '/api/hdr/auditEventApp';

  constructor(private http: HttpClient, private config: ConfigService) { }


  /**
     * Método para realizar un post al server
     * @param url
     * @param data
     */
  

  create(finalUrl: string, data: any) : Observable<any> {
   
          const body = data as Bundle<FhirResource>;

          console.log("Body: ", body, finalUrl, this.path_audit);

          return this.http.post<Bundle<FhirResource>>(finalUrl, body);


  }

 

}
