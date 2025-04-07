import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
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
    /*return this.http.post<Establishment[], EstablishmentFilter>('/api/rest/establecimiento/adm/search', filter).pipe(map(value => {
      if (value) return value;
      return [];
    }));*/
    return of(this.mockEstablishment);
  }

  private mockEstablishment: Establishment[] = [
    
    {
      "code": "EST001",
      "cif": "B12345678",
      "typeStablishment": "Farmacia",
      "typeProduct": "Medicamento",
      "centerName": "Farmacia Central",
      "codeRegion": "REG01",
      "descriptionRegion": "Castilla y León",
      "phone": "987654321",
      "address": "Calle Mayor, 123 - Valladolid",
      "codeFact": "FACT001",
      "dateTo": "2025-12-31"
    },
    {
      "code": "EST002",
      "cif": "A87654321",
      "typeStablishment": "Centro Médico",
      "typeProduct": "Ortopedia",
      "centerName": "Centro Salud Norte",
      "codeRegion": "REG02",
      "descriptionRegion": "Madrid",
      "phone": "912345678",
      "address": "Avenida Salud, 45 - Madrid",
      "codeFact": "FACT002"
    },
    {
      "code": "EST003",
      "cif": "C11223344",
      "typeStablishment": "Hospital",
      "typeProduct": "Material Médico",
      "centerName": "Hospital General",
      "codeRegion": "REG03",
      "descriptionRegion": "Cataluña",
      "phone": "933456789",
      "address": "Carrer Salut, 22 - Barcelona",
      "codeFact": "FACT003",
      "dateTo": "2026-06-15"
    }
  
]
}
