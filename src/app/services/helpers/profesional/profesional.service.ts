import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, map } from 'rxjs';
import { BillingActions } from '../../../bean/constants';
import { Establishment } from '../../../bean/models/administration';
import { ProfesionalActions, ProfesionalAdm } from '../../../bean/models/profesional';
import { ProfesionalDaoService } from '../../dao/profesional-dao.service';
import { KeycloakService } from '../../keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {

  private profesionalSubject: BehaviorSubject<ProfesionalAdm | null> = new BehaviorSubject<ProfesionalAdm | null>(null);
  public profesional$ = this.profesionalSubject.asObservable();

  private profesionalBillingActionsSubject: BehaviorSubject<BillingActions[]> = new BehaviorSubject<BillingActions[]>([]);
  public billingActions$ = this.profesionalBillingActionsSubject.asObservable();

  private establishmentSubject: BehaviorSubject<Establishment | null> = new BehaviorSubject<Establishment | null>(null);
  public center$ = this.establishmentSubject.asObservable();

  constructor(
    private profesionalDao: ProfesionalDaoService,
    private keycloack: KeycloakService,
    private router: Router) { }

  quitProfesional() {
    this.profesionalSubject.next(null);
    this.keycloack.logout();
  }

  pushProfesional(dni: string) {
    return this.profesionalDao.details({ dni }).pipe(map(data => {


      if (data) {
        console.log("Profesional", data);
        this.profesionalSubject.next(data);
        this.establishmentSubject.next(data.listEstablecimientos.at(0) || null);
        return data;
      } else return null;
    }));
  }

  pushCenter(center: Establishment) {
    return this.establishmentSubject.next(center);
  }

  searchProfesional() {
    return this.profesionalDao.search();
  }

  consultProfesional(dni: string) {
    return this.profesionalDao.details(<ProfesionalAdm>{ dni: dni });
  }

  addBillingActions(action: BillingActions) {
    const currentActions = this.profesionalBillingActionsSubject.value;
    this.profesionalBillingActionsSubject.next([...currentActions, action]);
  }

  resetBillingActions() {
    this.profesionalBillingActionsSubject.next([]);
  }

  //Valor que se devuelve asegurando que no es null (si fuera null quiere decir que no hay profesional definido lo que deberia impedir la navegacion)
  get profesionalReference() {
    return this.profesionalSubject.value?.code || '';
  }

  //Siempre se setea al iniciar la aplicacion para dispensacion
  get secureEstablishment() {
    return this.establishmentSubject.value!;
  }

  //Para facturacion, donde es opcional
  get establishment() {
    return this.establishmentSubject.value;
  }

  get profesional() {
    return this.profesionalSubject.value!;
  }

  get profesionalFullName() {
    return `${this.profesional?.name} ${this.profesional?.surname1} ${this.profesional?.surname2 || ''}`;
  }

}