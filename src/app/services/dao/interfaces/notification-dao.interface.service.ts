//import { Observable } from '@oh/hn-services/node_modules/rxjs';
import { Observable } from 'rxjs';
import { NotificationMessageRS } from '../../../bean/models/notification-message.bean';

//Este el dao(CRUD) que se genera a traves de una interface
export interface INotificationDAOServiceInterface {

    /**
     *  Método que obtiene la URL de servicio
     */
    getUrl(url: string, path: String): string;

    /**
     * Método que le pasas un criterio de busqueda y te devuelve las comunicaciones para ese criterio
     * @param userID
     * @param cipa
     * @param url
     */
    
   
    createNotification(data: NotificationMessageRS,url: string):Observable<any>;
    

}