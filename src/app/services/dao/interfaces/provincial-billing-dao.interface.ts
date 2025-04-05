import { Observable } from 'rxjs';
import { ProvinceBilling, ProvinceBillingCreate } from '../../../bean/models/billing';

export interface ProvincialBillingDao {

    create(billing: ProvinceBillingCreate): Observable<boolean>;

    searchProvincial(code: string): Observable<ProvinceBilling[]>;

    update(billing: ProvinceBilling): Observable<ProvinceBilling | null>;
}
