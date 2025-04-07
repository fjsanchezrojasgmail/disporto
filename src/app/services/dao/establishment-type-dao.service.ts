import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Establishment, EstablishmentType } from '../../bean/models/administration';
import { EstablishmentFilter } from '../../bean/models/billing';
import { HttpService } from '../http.service';
import { EstablishmentTypeDao } from './interfaces/establishment-type-dao.interface';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentTypeDaoService implements EstablishmentTypeDao {

  constructor(private http: HttpService) { }

  search(filter: EstablishmentFilter): Observable<EstablishmentType[]> {
    return this.http.post<EstablishmentType[], EstablishmentFilter>('/api/rest/tipoEstablecimiento/search', filter).pipe(map(value => {
      if (value) return value;
      return [];
    }));
  }
}