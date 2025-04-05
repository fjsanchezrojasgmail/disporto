import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HttpService } from '../http.service';
import { FindComunicationCriteria } from '../../bean/models/findComunication-criteria';
import { ComunicationMessageRS } from '../../bean/models/comunication-message.bean';
import { IComunicationDAOServiceInterface } from './interfaces/comunication-dao.interface.service';

@Injectable({ providedIn: 'root' })
export class ComunicationDAOService
  //extends GenericService<Bundle<any>> 
  implements IComunicationDAOServiceInterface {

  public pathResourceUpdate = '/rest/comunicacion/update';  // URL del servicio para actualizar
  public pathResourceCreate = '/rest/comunicacion/add';  // URL del servicio para añadir
  public pathSearch = '/rest/comunicacion/findComunicacion'; // URL buscar comunicacion
  public pathNumber = '/rest/comunicacion/numeroRegistros'; // URL buscar numero de comunicaciones
  public pathIfExists = '/rest/comunicacion/existenMensajes';// URL buscar si existen comunicaciones pasando cipa y codigo de producto

  public localUrl = 'http://localhost.indra.es:8085/hnanexo';
  public remoteUrl = 'http://ortosacyl.indra.es/hnanexo';
  /*  constructor(http: Http, loadService: LoadService)  {
      super(http, loadService);
  }  */


  constructor(
    private http: HttpService) {
  }



  getUrl(url: string, path: string): string {
    return this.remoteUrl + path;
  }

  findIfExistsComunication(data: ComunicationMessageRS, url: string): Observable<any> {
    /*return this.http.post<ComunicationMessageRS, ComunicationMessageRS>(this.pathIfExists, data).pipe(map(value => {
      if (value) return value;
      return [];
    }));*/

    return of(this.mockComunicationMessageRS);


  }

  findComunication(data: FindComunicationCriteria, url: string): Observable<any> {
    /*return this.http.post<ComunicationMessageRS, ComunicationMessageRS>(this.pathSearch, data).pipe(map(value => {
      if (value) return value;
      return [];
    }));*/
    return of(this.mockComunicationMessageRS);
    //return this.postData(this.getUrl(url, this.pathSearch), data, this.onServiceResponse);
    //return this.postData(url, data, this.onServiceResponse);
  }




  createComunication(data: ComunicationMessageRS, url: string): Observable<any> {

    //return this.postData(this.getUrl(url, this.pathResourceCreate), data, this.onServiceResponse);

    return this.http.post<ComunicationMessageRS, ComunicationMessageRS>(this.pathResourceCreate, data).pipe(map(value => {
      if (value) return true;
      else return false;
    }));

  }



  updateComunication(data: ComunicationMessageRS, url: string): Observable<any> {
    return this.http.post<ComunicationMessageRS, ComunicationMessageRS>(this.pathResourceUpdate, data).pipe(map(value => {
      if (value) return true;
      else return false;
    }));
  }


  numberOfComunications(data: ComunicationMessageRS, url: string): Observable<any> {
    /*return this.http.post<ComunicationMessageRS, ComunicationMessageRS>(this.pathNumber, data).pipe(map(value => {
      if (value) return value;
      return [];
    }));*/
    return of(1);
  }

  private mockComunicationMessageRS: ComunicationMessageRS[] = [{
    code: 'MSG001',
    originType: 'HOSPITAL',
    date: new Date('2024-12-01T10:30:00'),
    centerCode: 'C001',
    centerDesc: 'Hospital General',
    serviceDoctorCode: 'SD001',
    serviceDoctorDesc: 'Servicio de Traumatología',
    userID: 'USR123',
    userDesc: 'Dr. Juan Pérez',
    read: 'S',
    readDate: new Date('2024-12-02T09:15:00'),
    readCenterCode: 'C002',
    readCenterDesc: 'Centro de Salud Norte',
    readServiceDoctorCode: 'SD002',
    readServiceDoctorDesc: 'Servicio de Rehabilitación',
    readUserID: 'USR789',
    readUserDesc: 'Dra. Laura Gómez',
    requestgroupID: 'REQ789',
    cipa: '1234567890ABC',
    patientName: 'María López Ruiz',
    textMessage: 'Paciente requiere valoración adicional tras resonancia magnética.'
  }];


}