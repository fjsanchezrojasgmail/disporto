import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../http.service';
import { NotificationMessageRS } from '../../../bean/models/notification-message.bean';
import { INotificationDAOServiceInterface } from '../../dao/interfaces/notification-dao.interface.service';
import { HttpClientModule } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class NotificationDAOService
    //extends GenericService<Bundle<any>> 
    implements INotificationDAOServiceInterface {


    public pathResourceCreate = '/rest/notificaciones/add';  // URL del servicio para añadir
    public remoteUrl = 'http://ortosacyl.indra.es/hnanexo';
    public localUrl = 'http://localhost.indra.es:8085/hnanexo';

    /*  constructor(http: Http, loadService: LoadService)  {
        super(http, loadService);
    }  */


    constructor(
        private http: HttpService) {
    }



    getUrl(url: string, path: string): string {
        //return url + path;
        //return this.localUrl + path;
        return this.remoteUrl + path;
    }



    createNotification(data: NotificationMessageRS, url: string): Observable<boolean> {

        //return this.postData(this.getUrl(url, this.pathResourceCreate), data, this.onServiceResponse);

        return this.http.post<NotificationMessageRS, NotificationMessageRS>(this.pathResourceCreate, data).pipe(map(value => {
            if (value) return true;
            else return false;
        }));

    }




}