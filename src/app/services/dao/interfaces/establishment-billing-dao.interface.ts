import { Observable } from 'rxjs';
import { BillingGeneralFilter, EstablishmentBilling } from '../../../bean/models/billing';

export interface EstablishmentBillingDao {

    create(billing: EstablishmentBilling): Observable<boolean>;

    search(filter: BillingGeneralFilter): Observable<EstablishmentBilling[]>;

    deepSearch(filter: BillingGeneralFilter): Observable<EstablishmentBilling[]>;

    update(billing: Partial<EstablishmentBilling>): Observable<EstablishmentBilling | null>;

    stateUpdate(list: Partial<EstablishmentBilling>[]): Observable<boolean>;

}
