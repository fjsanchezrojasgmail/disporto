
import { ChangeDetectorRef, Component, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { TabMenu } from 'primeng/tabmenu';
import { Observable, tap } from 'rxjs';
import { SimplePatient } from '../../bean/models/patient';
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

  dispenableLabel = '';
  historyLabel = '';
  modificationsLabel = '';
  patient$: Observable<SimplePatient | null>;

  prescription?: Prescription;
  simplePatient?: SimplePatient;
  patientId = '';

  /** comprobacion de si existen o no comunicaciones */
  @Output() existComunication!: boolean;
  /** pasamos el objeto Prescription */
  //@Output() actual_prescription!: Prescription;

  constructor(
    private patientService: PatientService,
    private ref: ChangeDetectorRef,
    private translateService: TranslateService,
    private comunicationDAOService: ComunicationDAOService
  ) {
    this.patient$ = this.patientService.patient$;
    this.translateService
      .get('tabmenu.disp.dispensing.products')
      .subscribe((data) => (this.dispenableLabel = data));
    this.translateService
      .get('tabmenu.disp.dispensing.history')
      .subscribe((data) => (this.historyLabel = data));
    this.translateService
      .get('tabmenu.disp.dispensing.modifications')
      .subscribe((data) => (this.modificationsLabel = data));
  }

  ngOnInit() {
    this.tabItems = [
      {
        label: this.dispenableLabel,
        id: 'p1',
        command: (event: Event & { item: MenuItem }) =>
          (this.tabItemActive = event.item)
      },
      {
        label: this.historyLabel,
        id: 'p2',
        command: (event: Event & { item: MenuItem }) =>
          (this.tabItemActive = event.item)
      },
      {
        label: this.modificationsLabel,
        id: 'p3',
        command: (event: Event & { item: MenuItem }) =>
          (this.tabItemActive = event.item)
      }
    ];
    this.tabItemActive = this.tabItems[0];
    //le pasamos el cipa y si hay comunicaciones pone a true existComunication
    //this.readNumberOfComunicationMessages(this.patient$);
    this.patient$.pipe(tap((data) => this.getPatientCipa(data || undefined))).subscribe();
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
}

