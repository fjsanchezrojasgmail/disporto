import { Observable } from "rxjs";
import { ProfesionalAdm } from "../../../bean/models/profesional";

export interface ProfesionalDao {

    create(profesional: ProfesionalAdm) : Observable<boolean>;

    update(profesional: ProfesionalAdm) : Observable<boolean>; 

    search(profesional: ProfesionalAdm) : Observable<ProfesionalAdm[]>;

    details(profesional: ProfesionalAdm) : Observable<ProfesionalAdm | null>; 

}
