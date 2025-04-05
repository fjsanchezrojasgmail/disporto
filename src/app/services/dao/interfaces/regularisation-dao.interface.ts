import { Observable } from 'rxjs';
import { Regularisation } from '../../../bean/models/administration';
import { EstablishmentFilter } from '../../../bean/models/billing';

export interface RegularisationDao {

    search(filter: EstablishmentFilter): Observable<Regularisation[]>;

    create(regularisation: Regularisation): Observable<boolean>;

    update(regularisation: Regularisation): Observable<boolean>;
}
