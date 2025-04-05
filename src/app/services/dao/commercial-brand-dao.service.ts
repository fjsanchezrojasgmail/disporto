import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Brand } from '../../bean/models/product';
import { HttpService } from '../http.service';
import { CommercialBrandDao } from './interfaces/commercial-brand-dao';

@Injectable({
  providedIn: 'root'
})
export class CommercialBrandDaoService implements CommercialBrandDao {

  constructor(private http: HttpService) { }

  getBrandByProduct(id: string): Observable<Brand[] | null> {
    return this.http.post<Brand[], Record<string, string>>('/rest/articulo/adm/searchByProduct', { product: id.replace(' ', '|') })
      .pipe(map(value => {
        if (value) return value.map(b => <Brand>{ ...b, pvp: Number(b.pvp) || 0 });
        return null;
      }));
  }
}
