import { Titular } from './../../bean/models/billing';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Establishment } from '../../bean/models/administration';
import { BillingApiFilter, BillingGeneralFilter, BillingEstablishmentMasterFilter, BillingResponse, BillingStatePairs, EstablishmentBilling, EstablishmentMaster, Management, ProvinceBilling, EstablishmentFilter } from '../../bean/models/billing';
import { HttpService } from '../http.service';
import { EstablishmentBillingDao } from './interfaces/establishment-billing-dao.interface';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentBillingDaoService implements EstablishmentBillingDao {

  constructor(private http: HttpService) { }

  create(billing: EstablishmentBilling): Observable<boolean> {
    return this.http.post<BillingResponse, EstablishmentBilling>('/api/rest/facturacionCentro/adm/add', billing).pipe(map(value => {
      if (value) return value.code === 0;
      else return false;
    }));
  }

  update(billing: Partial<EstablishmentBilling>): Observable<EstablishmentBilling | null> {
    return this.http.post<EstablishmentBilling, Partial<EstablishmentBilling>>('/api/rest/facturacionCentro/adm/update', billing)
      .pipe(map(value => {
        if (value) return value;
        else return null;
      }));
  }

  search(filter: BillingGeneralFilter): Observable<EstablishmentBilling[]> {
    const customFilter: BillingApiFilter = {
      codeCenter: filter.code,
      codeRegion: filter.province?.code,
      codeTipoFactura: filter.billingType?.code,
      month: filter.month.code,
      year: filter.year.getFullYear()
    };
    return this.http.post<EstablishmentBilling[], BillingApiFilter>('/api/rest/facturacionCentro/adm/search', customFilter).pipe(map(
      value => {
        if (value) return value;
        return [];
      }));
  }

  searchEstablishment(code: string): Observable<EstablishmentBilling[]> {
    const customFilter: Partial<ProvinceBilling> = {
      codeFactura: code
    };
    return this.http.post<EstablishmentBilling[], Partial<ProvinceBilling>>('/api/rest/facturacionCentro/adm/search', customFilter).pipe(map(
      value => {
        if (value) return value;
        return [];
      }));
  }

  searchCOF(codeProvincialBilling: string): Observable<EstablishmentMaster[]> {
    const customFilter: BillingEstablishmentMasterFilter = { codProvincia: codeProvincialBilling };
    return this.http.post<EstablishmentMaster[], BillingEstablishmentMasterFilter>('/api/rest/tablasMaestras/cof/search', customFilter)
      .pipe(map(
        value => {
          if (value) return value;
          return [];
        }));
  }

  searchAsociacion(codeProvincialBilling: string): Observable<EstablishmentMaster[]> {
    const customFilter: BillingEstablishmentMasterFilter = { codProvincia: codeProvincialBilling };
    return this.http.post<EstablishmentMaster[], BillingEstablishmentMasterFilter>('/api/rest/tablasMaestras/asociacion/search', customFilter)
      .pipe(map(
        value => {
          if (value) return value;
          return [];
        }));
  }

  searchGerencia(codeProvincialBilling: string): Observable<Management[]> {
    const customFilter: BillingEstablishmentMasterFilter = { codProvincia: codeProvincialBilling };
    return this.http.post<Management[], BillingEstablishmentMasterFilter>('/api/rest/tablasMaestras/gerencia/search', customFilter)
      .pipe(map(
        value => {
          if (value) return value;
          return [];
        }));
  }

  searchTitular(codeEstablishment: string): Observable<Titular[]> {
    const customFilter: EstablishmentFilter = { code: codeEstablishment };
    return this.http.post<Titular[], EstablishmentFilter>('/api/rest/establecimiento/search/titular', customFilter)
      .pipe(map(
        value => {
          if (value) return value;
          return [];
        }));
  }

  deepSearch(filter: BillingGeneralFilter): Observable<EstablishmentBilling[]> {
    const customFilter: BillingApiFilter = {
      codeCenter: filter.code,
      codeRegion: filter.province?.code,
      codeTipoFactura: filter.billingType?.code,
      month: filter.month.code,
      year: filter.year.getFullYear(),
      flagDatos: filter.flag
    };
    return this.http.post<EstablishmentBilling[], BillingApiFilter>('/api/rest/facturacionDatos/search', customFilter).pipe(map(
      value => {
        if (value) return value;
        return [];
      }));
  }

  stateUpdate(list: BillingStatePairs[]): Observable<boolean> {
    return this.http.post<EstablishmentBilling[], BillingStatePairs[]>('/api/rest/facturacionDatos/updateEstado', list).pipe(map(
      value => {
        if (value) return true;
        return false;
      }));
  }

  checkPendings(filter: BillingGeneralFilter): Observable<Partial<Establishment>[]> {
    const customFilter: BillingApiFilter = {
      codeCenter: filter.code,
      codeRegion: filter.province?.code,
      codeTipoFactura: filter.billingType?.code,
      month: filter.month.code,
      year: filter.year.getFullYear()
    };
    return this.http.post<Partial<Establishment>[], BillingApiFilter>('/api/rest/facturacionCentro/adm/searchCenter', customFilter)
      .pipe(map(
        value => {
          if (value) return value;
          return [];
        }));
  }
}