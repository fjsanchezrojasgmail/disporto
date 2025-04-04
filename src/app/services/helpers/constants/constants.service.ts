import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from '../../http.service';
import { Constants } from '../../../bean/models/constant';

@Injectable({ providedIn: 'root' })

export class ConstantsService{

 public pathSearch = '/rest/constante/adm/search'; // URL buscar constante

 private constant = {
    code: '',
    description: '',
    value: ''
  };


  public localUrl = 'http://localhost.indra.es:8085/hnanexo';
  public remoteUrl = 'http://ortosacyl.indra.es/hnanexo';

  constructor(
    private http: HttpService) {
  }



  getUrl(url: string, path: string): string {
    return this.remoteUrl + path;
  }


  findConstants(constantString: string): Observable<any> {

    this.constant.code = constantString;


    return this.http.post<Constants, Constants>(this.pathSearch, this.constant).pipe(map(value => {
      if (value) return value;
      return [];
    }));

  }

}
