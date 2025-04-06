

import { ChangeDetectorRef, Component, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { TabMenu } from 'primeng/tabmenu';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { dummyPatient, SimplePatient } from '../../bean/models/patient';
import { Prescription } from '../../bean/models/prescription';



import { PatientService } from '../../services/helpers/patient/patient.service';
import { ComunicationMessageRS } from '../../bean/models/comunication-message.bean';
import { ComunicationDAOService } from '../../services/dao/comunication-dao.service';
import { PatientIdentificationComponent } from './patient-identification/patient-identification.component';
import { PatientHeaderComponent } from './patient-header/patient-header.component';
import { CommonModule } from '@angular/common';
import { DispensableProductsComponent } from './dispensable-products/dispensable-products.component';
import { HistoricalComponent } from './historical/historical.component';
import { ModificationsComponent } from './modifications/modifications.component';
import { PrescriptionDetailComponent } from './prescription-detail/prescription-detail.component';
import { Gender } from '../../bean/fhir-r3/fhir-constants';
import { PatientModel } from '../../bean/fhir-r3/domain/patient';
import { RequestGroupDaoService } from '../../services/dao/request-group-dao.service';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'sacyl-dispensations',
  standalone: true,
  imports: [
    CommonModule,
    TabMenu,
    PatientIdentificationComponent,
    PatientHeaderComponent,
    DispensableProductsComponent,
    HistoricalComponent,
    ModificationsComponent,
    PrescriptionDetailComponent
  ],
  templateUrl: './dispensations.component.html',
  styleUrls: ['./dispensations.component.css'],
  providers: [PatientService, ComunicationDAOService]
})
export class DispensationsComponent {
  tabItems: MenuItem[] = [];
  tabItemActive?: MenuItem;

  dispensableLabel!: string;
  historyLabel!: string;
  modificationsLabel!: string;
  patient$: Observable<SimplePatient | null>;

  prescription?: Prescription;
  simplePatient?: SimplePatient;
  patientId = '';
  criteria!: HttpParams;

  /** comprobacion de si existen o no comunicaciones */
  @Output() existComunication!: boolean;
  /** pasamos el objeto Prescription */
  //@Output() actual_prescription!: Prescription;

  constructor(
    private patientService: PatientService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
    private comunicationDAOService: ComunicationDAOService,
    private requestGroupDAOService: RequestGroupDaoService,
  ) {
    this.patient$ = this.patientService.patient$;

    this.patient$ = of(dummyPatient);
    
    
  }

  ngOnInit() {
    forkJoin({
      products: this.translateService.get('tabmenu.disp.dispensing.products'),
      history: this.translateService.get('tabmenu.disp.dispensing.history'),
      modifications: this.translateService.get('tabmenu.disp.dispensing.modifications')
    }).subscribe(translations => {
      this.tabItems = [
        {
          label: translations.products,
          id: 'p1',
          command: (event: Event & { item: MenuItem }) =>
            (this.tabItemActive = event.item)
        },
        {
          label: translations.history,
          id: 'p2',
          command: (event: Event & { item: MenuItem }) =>
            (this.tabItemActive = event.item)
        },
        {
          label: translations.modifications,
          id: 'p3',
          command: (event: Event & { item: MenuItem }) =>
            (this.tabItemActive = event.item)
        }
      ];
      this.tabItemActive = this.tabItems[0]; // si deseas que esté activo el primero
      this.ref.detectChanges(); // solo si estás teniendo problemas de renderizado
    });

    this.requestGroupDAOService.getPrescription().subscribe((data)=>{
      if(data)
      this.prescription = data;
    });
    
  }

  //obtenemos el cipa del paciente y leemos el numero de mensajes que hay disponibles para el
  getPatientCipa(data: SimplePatient | undefined): string | undefined {
    this.simplePatient = data;

    this.readNumberOfComunicationMessages(this.simplePatient?.cipa);
    return this.simplePatient?.cipa;
  }

  /*
Metodo que devuelve el numero de registros de las comunicaciones
*/
  readNumberOfComunicationMessages(patientCipa: string | undefined) {

    const comunicationRS = new ComunicationMessageRS();
    comunicationRS.cipa = patientCipa;

    this.comunicationDAOService.numberOfComunications(
      comunicationRS,
      this.comunicationDAOService.getUrl(
        this.comunicationDAOService.localUrl, this.comunicationDAOService.pathNumber)).pipe(
          tap(result => this.checkExistsComunications(result))).subscribe();
  }

  /*
Metodo que comprueba si existen comunicaciones
*/
  checkExistsComunications(numberComunications: string) {
    this.existComunication = false;
    if (Number(numberComunications) > 0) {
      this.existComunication = true;
    }
  }

  quitPatient() {
    this.prescription = undefined;
    this.tabItemActive = this.tabItems[0];
    this.patientService.clearPatient();
  }

  private patient: PatientModel = {
      resourceType: "Patient",
      id: "example-patient-001",
      mapToFhir: () => {
        return {
          resourceType: "Patient",
          id: "mapped-from-model",
          "name": [
        {
          "resourceType": "HumanName",
          "use": "official",
          "family": "Donald",
          "given": [
            "Duck"
          ]
        } 
      ],
        };
      },
      mapToModel: () => {
        return {
          "id": "pat1",
          "disability":0,
          "birthDate" : "1990-01-01",
          "name": "Pedro Perez"
        };
      },
      identifier: [
        {
          use: "usual",
          type: {
            coding: [
              {
                system: "http://hl7.org/fhir/v2/0203",
                code: "MR"
              }
            ]
          },
          system: "http://hospital.example.org/patients",
          value: "12345678"
        }
      ],
      name: [
        {
          resourceType: "HumanName",
          use: "official",
          family: "García",
          given: ["Pedro"]
        }
      ],
      gender: Gender.MALE,
      birthDate: "1990-01-01",
      address: [],
      link: [],
      text: {
        status: "generated",
        div: "<div>Pedro García</div>"
      }
    };
}

