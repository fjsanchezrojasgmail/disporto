import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BillingResponse, ProvinceBilling, ProvinceBillingCreate } from '../../bean/models/billing';
import { HttpService } from '../http.service';
import { ProvincialBillingDao } from './interfaces/provincial-billing-dao.interface';

@Injectable({
  providedIn: 'root'
})
export class ProvincialBillingDaoService implements ProvincialBillingDao {

  constructor(private http: HttpService) { }

  create(billing: ProvinceBillingCreate): Observable<boolean> {
    return this.http.post<BillingResponse, ProvinceBillingCreate>('/api/rest/facturacionProvincial/adm/add', billing).pipe(map(value => {
      if (value) return true;
      else return false;
    }));
  }
  update(billing: ProvinceBilling): Observable<ProvinceBilling | null> {
    return this.http.post<ProvinceBilling, ProvinceBilling>('/api/rest/facturacionProvincial/adm/update', billing).pipe(map(value => {
      if (value) return value;
      else return null;
    }));
  }

  searchProvincial(code: string): Observable<ProvinceBilling[]> {
    const customFilter: Partial<ProvinceBilling> = {
      codeFactura: code
    };
    return this.http.post<ProvinceBilling[], Partial<ProvinceBilling>>('/api/rest/facturacionProvincial/adm/search', customFilter).pipe(map(
      value => {
        if (value) return value;
        return [];
      }));
  }
}
