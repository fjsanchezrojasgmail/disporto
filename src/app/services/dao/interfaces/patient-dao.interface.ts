import { Observable } from "rxjs";
import { Bundle } from "../../../bean/fhir-r3/domain/interfaces/bundle.interface";
import { PatientModel } from "../../../bean/fhir-r3/domain/patient";
import { SearchPatientFilter } from "../../../bean/models/patient";

export interface PatientDao {

    getPatient(filter: SearchPatientFilter): Observable<PatientModel | null>;
    
}
