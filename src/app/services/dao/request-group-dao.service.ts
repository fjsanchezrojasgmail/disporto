import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Bundle } from '../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { HttpService } from '../http.service';
import { RequestGroupDao } from './interfaces/request-group-dao.interface';
import { RequestGroup } from '../../bean/fhir-r3/domain/interfaces/request-group.interface';
import { BundleModel } from '../../bean/fhir-r3/domain/bundle';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class RequestGroupDaoService implements RequestGroupDao {

  private apiUrl = '/api/hdr/fhir/RequestGroup';

  constructor(private http: HttpService, private config: ConfigService) { }

  search(criteria: HttpParams): Observable<BundleModel | null> {
    return this.http.get<Bundle<RequestGroup>>(this.apiUrl, { params: criteria }).pipe(map(value => (value) ? new BundleModel(value) : null));
  }

  page(url: string) {
    return this.http.get<Bundle<RequestGroup>>(url).pipe(map(value => (value) ? new BundleModel(value) : null));
  }
}
