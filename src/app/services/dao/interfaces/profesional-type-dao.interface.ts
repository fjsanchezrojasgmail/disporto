import { Observable } from 'rxjs';
import { ProfessionalType } from '../../../bean/models/administration';
import { ProfessionalFilter } from '../../../bean/models/billing';


export interface ProfesionalTypeDao {

   

    search(filter: ProfessionalFilter): Observable<ProfessionalType[]>;

  

}