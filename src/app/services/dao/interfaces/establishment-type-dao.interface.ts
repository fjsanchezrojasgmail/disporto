import { Observable } from 'rxjs';
import { EstablishmentType } from '../../../bean/models/administration';
import { EstablishmentFilter } from '../../../bean/models/billing';

export interface EstablishmentTypeDao {

   

    search(filter: EstablishmentFilter): Observable<EstablishmentType[]>;

  

}