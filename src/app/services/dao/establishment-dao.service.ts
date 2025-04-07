import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Establishment, EstablishmentAdm } from '../../bean/models/administration';
import { EstablishmentFilter } from '../../bean/models/billing';
import { HttpService } from '../http.service';
import { EstablishmentDao } from './interfaces/establishment-dao.interface';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentDaoService implements EstablishmentDao {

  constructor(private http: HttpService) { }

  create(establishment: Establishment): Observable<boolean> {
    return this.http.post<Establishment, Establishment>('/api/rest/establecimiento/adm/add', establishment).pipe(map(value => {
      if (value) return true;
      else return false;
    }));
  }
  update(establishment: Establishment): Observable<boolean> {
    return this.http.post<Establishment, Establishment>('/api/rest/establecimiento/adm/update', establishment).pipe(map(value => {
      if (value) return true;
      else return false;
    }));
  }
  updateAdm(establishment: EstablishmentAdm): Observable<boolean> {
    return this.http.post<EstablishmentAdm, EstablishmentAdm>('/api/rest/establecimiento/adm/update', establishment).pipe(map(value => {
      if (value) return true;
      else return false;
    }));
  }
  search(filter: EstablishmentFilter): Observable<Establishment[]> {
    return this.http.post<Establishment[], EstablishmentFilter>('/api/rest/establecimiento/adm/search', filter).pipe(map(value => {
      if (value) return value;
      return [];
    }));
  }
}
