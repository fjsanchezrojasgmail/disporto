import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ProfesionalAdm } from '../../bean/models/profesional';
import { HttpService } from '../http.service';
import { ProfesionalDao } from './interfaces/profesional-dao.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalDaoService implements ProfesionalDao {

  constructor(private http: HttpService) { }

  create(profesional: ProfesionalAdm): Observable<boolean> {
    return this.http.post<ProfesionalAdm, ProfesionalAdm>('/api/rest/profesional/adm/add', profesional).pipe(map(value => {
      if (value) return true;
      else return false;
    }));
  }
  update(profesional: ProfesionalAdm): Observable<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { state, ...prof } = profesional;
    return this.http.post<ProfesionalAdm, ProfesionalAdm>('/api/rest/profesional/adm/update', prof).pipe(map(value => {
      if (value) return true;
      else return false;
    }));
  }

  search(): Observable<ProfesionalAdm[]> {
    /*return this.http.post<ProfesionalAdm[], Partial<ProfesionalAdm>>('/api/rest/profesional/adm/search', {}).pipe(map(value => {
      if (value) return value;
      return [];
    }));*/
    return of(this.profesionalMockData);
  }

  details(profesional: Partial<ProfesionalAdm>): Observable<ProfesionalAdm | null> {
    /*return this.http.post<ProfesionalAdm, Partial<ProfesionalAdm>>('/api/rest/profesional/adm/details', profesional).pipe(map(value => {
      if (value) return value;
      else return null;
    }));*/
    console.log("Profesional", this.profesionalMockData[0]);
    return of(this.profesionalMockData[0]);
  }

  //mockData



  private profesionalMockData: ProfesionalAdm[] = [

        {
        "code": "prof001",
        "name": "profesional1",
        "surname1": "surname11",
        "surname2": "surname21",
        "dni": "11111111A",
        "phone": "111111111",
        "state": true,
        "dateTo": "",
        "typeProfesional": "DISPENSER_ESTABLISHMENT",
        "titular": "S",
        "permissionFac": "S",
        "listEstablecimientos": [
          {
          "code": "Estab001",
          "cif": "11111111A",
          "typeStablishment": "Establishment1",
          "typeProduct" : "Product1",
          "centerName": "centerName1",
          "codeRegion": "01",
          "descriptionRegion": "Ávila",
          "phone": "111111111",
          "address": "address1",
          "codeFact": "111111111",
          "dateTo": ""
        },
      ],
        "provinces": [
        {
          "code": "01",
          "description": "Ávila"
        },
        {
          "code": "02",
          "description": "Burgos"
        },
        {
          "code": "03",
          "description": "León"
        },
        {
          "code": "04",
          "description": "Palencia"
        },
        {
          "code": "05",
          "description": "Salamanca"
        },
        {
          "code": "06",
          "description": "Segovia"
        },
        {
          "code": "07",
          "description": "Soria"
        },
        {
          "code": "08",
          "description": "Valladolid"
        },
        {
          "code": "09",
          "description": "Zamora"
        }
      ]
        },

  ]
}
