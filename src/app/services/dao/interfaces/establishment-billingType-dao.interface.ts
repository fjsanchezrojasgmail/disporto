import { Observable } from 'rxjs';
import { EstablishmentBillingType } from '../../../bean/models/administration';
import { EstablishmentFilter } from '../../../bean/models/billing';

export interface EstablishmentBillingTypeDao {

   

    search(filter: EstablishmentFilter): Observable<EstablishmentBillingType[]>;

  

}