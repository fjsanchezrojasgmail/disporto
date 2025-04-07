import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProfessionalType } from '../../bean/models/administration';
import { ProfessionalFilter } from '../../bean/models/billing';
import { HttpService } from '../http.service';
import { ProfesionalTypeDao } from './interfaces/profesional-type-dao.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalTypeDaoService implements ProfesionalTypeDao {

  constructor(private http: HttpService) { }

  search(filter: ProfessionalFilter): Observable<ProfessionalType[]> {
    return this.http.post<ProfessionalType[], ProfessionalFilter>('/api/rest/tipoProfesional/search', filter).pipe(map(value => {
      if (value) return value;
      return [];
    }));
  }
}