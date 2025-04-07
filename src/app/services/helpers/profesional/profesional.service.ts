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
    //return this.establishmentSubject.value!;
    return { 
      "code" : this.mockEstablishment[0].code,
      "centerName" : this.mockEstablishment[0].centerName,
      "typeProduct" : this.mockEstablishment[0].typeProduct
    };
  }

  //Para facturacion, donde es opcional
  get establishment() {
    //return this.establishmentSubject.value;
    return { 
      "code" : this.mockEstablishment[0].code,
      "centerName" : this.mockEstablishment[0].centerName,
      "typeProduct" : this.mockEstablishment[0].typeProduct,
      "typeStablishment" : this.mockEstablishment[0].typeStablishment,
      "codeRegion" : this.mockEstablishment[0].codeRegion,
      "descriptionRegion":  this.mockEstablishment[0].descriptionRegion,
      "codeFact" : this.mockEstablishment[0].codeFact,
      "cif": this.mockEstablishment[0].cif,
      "phone": this.mockEstablishment[0].phone,
      "address": this.mockEstablishment[0].address,
    };
  }

  get profesional() {
    //return this.profesionalSubject.value!;
    return this.mockProfesional[0];
  }

  get profesionalFullName() {
    return `${this.profesional?.name} ${this.profesional?.surname1} ${this.profesional?.surname2 || ''}`;
  }

  private mockProfesional: ProfesionalAdm[] = [
    {
      "code": "PROF001",
      "name": "Laura",
      "surname1": "González",
      "surname2": "Martínez",
      "dni": "12345678A",
      "phone": "600123456",
      "state": true,
      "dateTo": "2026-01-01",
      "typeProfesional": "Administrador",
      "titular": "S",
      "permissionFac": "Alta",
      "listEstablecimientos": [
        {
          "code": "EST001",
          "cif": "B12345678",
          "typeStablishment": "Farmacia",
          "typeProduct": "Medicamento",
          "centerName": "Farmacia Central",
          "codeRegion": "REG01",
          "descriptionRegion": "Castilla y León",
          "phone": "987654321",
          "address": "Calle Mayor, 123 - Valladolid",
          "codeFact": "FACT001",
          "dateTo": "2025-12-31"
        }
      ],
      "provinces": [
        {
          "code": "P001",
          "description": "Valladolid"
        },
        {
          "code": "P002",
          "description": "Salamanca"
        }
      ]
    },
    {
      "name": "Carlos",
      "surname1": "Pérez",
      "surname2": "López",
      "dni": "87654321B",
      "phone": "611223344",
      "typeProfesional": "Técnico",
      "titular": "N",
      "permissionFac": "Consulta",
      "listEstablecimientos": [
        {
          "code": "EST002",
          "cif": "A87654321",
          "typeStablishment": "Centro Médico",
          "typeProduct": "Ortopedia",
          "centerName": "Centro Salud Norte",
          "codeRegion": "REG02",
          "descriptionRegion": "Madrid",
          "phone": "912345678",
          "address": "Avenida Salud, 45 - Madrid",
          "codeFact": "FACT002"
        }
      ],
      "provinces": [
        {
          "code": "P003",
          "description": "Madrid"
        }
      ]
    }
  ];

  private mockEstablishment: Establishment[] = [
    
      {
        "code": "EST001",
        "cif": "B12345678",
        "typeStablishment": "Farmacia",
        "typeProduct": "Medicamento",
        "centerName": "Farmacia Central",
        "codeRegion": "REG01",
        "descriptionRegion": "Castilla y León",
        "phone": "987654321",
        "address": "Calle Mayor, 123 - Valladolid",
        "codeFact": "FACT001",
        "dateTo": "2025-12-31"
      },
      {
        "code": "EST002",
        "cif": "A87654321",
        "typeStablishment": "Centro Médico",
        "typeProduct": "Ortopedia",
        "centerName": "Centro Salud Norte",
        "codeRegion": "REG02",
        "descriptionRegion": "Madrid",
        "phone": "912345678",
        "address": "Avenida Salud, 45 - Madrid",
        "codeFact": "FACT002"
      },
      {
        "code": "EST003",
        "cif": "C11223344",
        "typeStablishment": "Hospital",
        "typeProduct": "Material Médico",
        "centerName": "Hospital General",
        "codeRegion": "REG03",
        "descriptionRegion": "Cataluña",
        "phone": "933456789",
        "address": "Carrer Salut, 22 - Barcelona",
        "codeFact": "FACT003",
        "dateTo": "2026-06-15"
      }
    
  ]

}