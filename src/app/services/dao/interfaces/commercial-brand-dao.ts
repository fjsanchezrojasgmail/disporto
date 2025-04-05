import { Observable } from 'rxjs';
import { Brand } from '../../../bean/models/product';

export interface CommercialBrandDao {

    getBrandByProduct(id: string): Observable<Brand[] | null>;
}
