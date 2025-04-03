//import { Observable } from '@oh/hn-services/node_modules/rxjs';
import { Observable } from 'rxjs';
import { FindComunicationCriteria } from '../../../bean/models/findComunication-criteria';
import { ComunicationMessageRS } from '../../../bean/models/comunication-message.bean';

//Este el dao(CRUD) que se genera a traves de una interface
export interface IComunicationDAOServiceInterface {

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
    findIfExistsComunication(data: ComunicationMessageRS,url: string):Observable<any>;
    findComunication(data: FindComunicationCriteria, url: string): Observable<any>;
    updateComunication(data: ComunicationMessageRS,url: string):Observable<any>;
    createComunication(data: ComunicationMessageRS,url: string):Observable<any>;
    numberOfComunications(data: ComunicationMessageRS,url: string):Observable<any>;

}