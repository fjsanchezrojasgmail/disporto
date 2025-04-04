import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../http.service';
import { Prescription, PrescriptionRow } from '../../../bean/models/prescription';
import { LoadService } from '../../load.service';
import { DocumentId, PayLoadCustody } from '../../..//bean/models/administration';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { FhirTypes } from '../../../bean/fhir-r3/fhir-constants';
import { ConstantsService } from '../../constants.service';




@Injectable({ providedIn: 'root' })
export class CustodiaService{


    public pathResourceCreate = '/api/rest/sendDispensationDocument';  // URL del servicio para añadir
    public pathResourceGet = '/api/rest/getDispensationDocument';  // URL del servicio para añadir
    public remoteUrl = 'http://ortosacyl.indra.es/disporto';

    constructor(
        private http: HttpService,private loadService: LoadService, private constantService: ConstantsService) {
    }

    getUrl(url: string, path: string): string {
        return this.remoteUrl + path;
    }

    sendDispensationDocument(pdfbase64: string,prescriptions: Prescription[]){


        const body : PayLoadCustody = {
            document: pdfbase64,
            fileName: formatDate(new Date(),'dd/MM/yyyy-HH:mm','es') + "_custody_document",
            typeResource: FhirTypes.REQUEST_GROUP,
            idResource: prescriptions.map(p=> p.id)
        }

        return this.http.post<DocumentId, PayLoadCustody>(this.pathResourceCreate, body).pipe(

            map(value => {

            if (value){

                return value.idDocument;

            }else{

                return 0;

            }

        }));

    }
    getDispensationDocument(idDocument: string){

        const headers = new HttpHeaders().append('Content-Type', 'application/json');
        const params = new HttpParams().append("documentId",idDocument);

        return this.http.get<string>(this.pathResourceGet, { headers: headers, params: params }).pipe(map(data => {
            if (data) return data;
            else return 0;
        }));

    }

}
