import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EstablishmentBillingType } from '../../bean/models/administration';
import { EstablishmentFilter } from '../../bean/models/billing';
import { HttpService } from '../http.service';
import { EstablishmentBillingTypeDao } from './interfaces/establishment-billingType-dao.interface';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentBillingTypeDaoService implements EstablishmentBillingTypeDao {

  constructor(private http: HttpService) { }

  search(filter: EstablishmentFilter): Observable<EstablishmentBillingType[]> {
    return this.http.post<EstablishmentBillingType[], EstablishmentFilter>('/api/rest/tipoFacturacion/search', filter).pipe(map(value => {
      if (value) return value;
      return [];
    }));
  }
}