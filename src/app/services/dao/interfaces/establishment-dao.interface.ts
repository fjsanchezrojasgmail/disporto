import { Observable } from 'rxjs';
import { Establishment } from '../../../bean/models/administration';
import { EstablishmentFilter } from '../../../bean/models/billing';

export interface EstablishmentDao {

    search(filter: EstablishmentFilter): Observable<Establishment[]>;

    create(establishment: Establishment): Observable<boolean>;

    update(establishment: Establishment): Observable<boolean>;
}
