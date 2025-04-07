import { Injectable } from '@angular/core';
import { ReportsDao } from './interfaces/reports-dao.interface';
import { Observable, map } from 'rxjs';
import { ReportCriteria, OrtoReport } from 'src/app/bean/models/listings';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root'
  })

export class ReportsDaoService implements ReportsDao {
  
  urlConsumo1 = '/api/rest/informes/consumoPresupuesto1';
  urlConsumo2 = '/api/rest/informes/consumoPresupuesto2';
  urlArticulos = '/api/rest/informes/consumoArticulos';
  urlEstablecimiento = '/api/rest/informes/consumoEstablecimiento';
  urlPrescriptorEstablecimiento = '/api/rest/informes/consumoPrescriptorEstablecimiento';
  urlEstablecimientoPrescriptor = '/api/rest/informes/consumoEstablecimientoPrescriptor';
  urlPaciente = '/api/rest/informes/consumoPaciente';

constructor(private http: HttpService) { }

  searchConsumo(query: number, criteria: ReportCriteria): Observable<OrtoReport[]> {
    let queryUrl = this.urlConsumo1;
    if (query === 2) queryUrl = this.urlConsumo2;
    return this.http.post<OrtoReport[], ReportCriteria>(queryUrl, criteria).pipe(map( value => {
      if (value) return value;
      return [];
    }));
  }

  searchArticulo(criteria: ReportCriteria): Observable<OrtoReport[]> {
    return this.http.post<OrtoReport[], ReportCriteria>(this.urlArticulos, criteria).pipe(map( value => {
      if (value) return value;
      return [];
    }));
  }

  searchEstablecimiento(criteria: ReportCriteria): Observable<OrtoReport[]> {
    return this.http.post<OrtoReport[], ReportCriteria>(this.urlEstablecimiento, criteria).pipe(map( value => {
      if (value) return value;
      return [];
    }));
  }

  searchPrescriptorEstablecimiento(criteria: ReportCriteria): Observable<OrtoReport[]> {
    return this.http.post<OrtoReport[], ReportCriteria>(this.urlPrescriptorEstablecimiento, criteria).pipe(map( value => {
      if (value) return value;
      return [];
    }));
  }

  searchEstablecimientoPrescriptor(criteria: ReportCriteria): Observable<OrtoReport[]> {
    return this.http.post<OrtoReport[], ReportCriteria>(this.urlEstablecimientoPrescriptor, criteria).pipe(map( value => {
      if (value) return value;
      return [];
    }));
  }

  searchPaciente(criteria: ReportCriteria): Observable<OrtoReport[]> {
    return this.http.post<OrtoReport[], ReportCriteria>(this.urlPaciente, criteria).pipe(map( value => {
      if (value) return value;
      return [];
    }));
  }

}
