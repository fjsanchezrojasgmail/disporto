import { Observable } from 'rxjs';
import { OrtoReport, ReportCriteria } from './../../../bean/models/listings';
export interface ReportsDao {

//TO-DO: Mirar DAOs y servicios similares

searchConsumo(query: number, criteria: ReportCriteria): Observable<OrtoReport[]>;

}
 