
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MaxPageSize, PrescriptionActions } from '../../../bean/constants';
import { SimplePatient } from '../../../bean/models/patient';
import { Prescription, PrescriptionRow } from '../../../bean/models/prescription';
import { HistoricFilter } from '../../../bean/simple.types';
import { HistoricalFilterComponent } from '../historical/historical-filter/historical-filter.component'
import { HistoricalService } from '../../../services/dedicated/prescription/historical.service';
import { ComunicationModalComponent } from '../shared/comunication-modal/comunication-modal.component';
import { FindComunicationCriteria } from '../../../bean/models/findComunication-criteria';
import { ComunicationsRS } from '../../../bean/models/comunications.bean';
import { ComunicationMessageRS } from '../../../bean/models/comunication-message.bean';
import { ComunicationDAOService } from '../../../services/dao/comunication-dao.service';
import { tap, filter } from 'rxjs/operators';
import { ProfesionalAdm } from '../../../bean/models/profesional';
import { ProfesionalService } from '../../../services/helpers/profesional/profesional.service';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NoResultsComponent } from '../../shared/no-results/no-results.component';
import { ProductAportationComponent } from '../shared/product-aportation/product-aportation.component'
import { PvpInputComponent } from '../shared/pvp-input/pvp-input.component';
import { UnitsInputComponent } from '../shared/units-input/units-input.component';

@Component({
  selector: 'sacyl-historical',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    TranslateModule,
    NoResultsComponent,
    ComunicationModalComponent,
    HistoricalFilterComponent,
    ProductAportationComponent,
    PvpInputComponent,
    UnitsInputComponent,
  ],
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.css', '../dispensable-products/dispensable-products.component.css'],
  providers: [HistoricalService]
})
export class HistoricalComponent implements OnInit {

  @Input() patient!: SimplePatient;

  /** comprobacion de si existen o no comunicaciones */
  @Input() existComunication!: boolean;

  @Output() prescriptionDetails: EventEmitter<Prescription> = new EventEmitter();

  prescriptions$: Observable<PrescriptionRow[]>;

  loading = false;

  expandedRowKeys: Record<string, boolean> = {};

  rows = MaxPageSize;

  currentPage = 0;

  /**comunicaciones */
  @Output() actual_patient!: SimplePatient;
  @Output() patientCipa!: string | undefined;
  @Output() actual_profesional_user_id!: string;
  @Output() actual_profesional_center!: string;
  @Output() actual_product_code!: string;
  @Output() actual_requestGroup!: string;
  @Output() actual_prescriptor_dni!: string;
  @Output() actual_prescriptor_name!: string;
  @Output() actual_prescription!: PrescriptionRow;




  /** comprobacion de si existen o no comunicaciones en el menu action */
  @Output() menuActionIfExistComunicationInBBDD!: boolean;

  @Output() localLstResultComunicationView!: ComunicationMessageRS[];

  @ViewChild(ComunicationModalComponent) comunicationModal!: ComunicationModalComponent;





  profesional$!: Observable<ProfesionalAdm | null>;

  profesional_user_id!: string;

  //existMenuComunication!: boolean;

  /** comprobacion de si existen o no comunicaciones en BBDD */
  existComunicationInBBDD!: boolean;

  product_code!: string;
  requestGroupId!: string;
  prescriptionStatus!: string;
  desactiveCommunicationMessages!: boolean;

  /*Informacion de las comunicaciones*/

  public comunicationCriteria!: FindComunicationCriteria;
  public comunicationRS!: ComunicationsRS;

  /*
   Datos de las comunicaciones para la opcion del menu
 */
  lstResultComunication!: ComunicationsRS[];
  localLstResultComunication!: ComunicationMessageRS[];
  lstPrescriptionStatus: string[] = ['ANULADA', 'PRESCDISPENSADA', 'ANULADABLOQUEOCAUTELAR', 'BLOQUEOCAUTELARADMITIDO', 'PRESCBLOQUEOCAUTELAR'];

  constructor(private profesionalService: ProfesionalService,
    private historicalService: HistoricalService,
    @Inject('IComunicationDAOService') private comunicationDAOService: ComunicationDAOService
  ) {
    this.prescriptions$ = this.historicalService.prescriptions$;
    this.historicalService.loading$.subscribe(data => this.loading = data);
    this.prescriptions$.subscribe(data => {
      data.map(p => this.expandedRowKeys[p.id] = p.expanded);
      this.prescriptions$.subscribe(data => {
        data.map(p => this.actual_prescriptor_dni = p.profesional?.dni || '');
      });

      this.prescriptions$.subscribe(data => {
        data.map(p => this.actual_prescriptor_name = p.profesional?.name || '');
      });
    });


    //obtencion de datos del observable profesional
    this.profesional$ = this.profesionalService.profesional$;
    this.profesional_user_id = profesionalService.profesional?.name || '';
    this.actual_profesional_center = profesionalService.profesional?.listEstablecimientos.at(0)?.centerName || '';


  }

  ngOnInit(): void {


    //cargamos datos de paciente y profesional logado
    this.actual_patient = this.patient;
    this.patientCipa = this.patient.cipa;



    //cargamos mensajes de la BBDD
    this.chargeMessagesFromBBDD(this.patient);

  }


  paginate($event: Event & { page: number }) {
    this.currentPage = $event.page;
  }

  paginationPrescriptions(prescripcions: PrescriptionRow[]) {
    return prescripcions.slice(this.currentPage * this.rows, ((this.currentPage + 1) * this.rows));
  }

  refreshHistoric(filter: HistoricFilter) {
    this.historicalService.searchProducts(this.patient, filter);
  }

  showProducts($event: Event & { data: PrescriptionRow }) {
    this.historicalService.expandProducts($event.data.id);
  }

  menuAction(prescription: PrescriptionRow, action: PrescriptionActions) {

    this.product_code = prescription.products[0].code;
    this.actual_product_code = prescription.products[0].code;
    this.actual_requestGroup = prescription.id;


    switch (action) {

      case PrescriptionActions.COMMUNICATE:


        //comprobamos si hay comunicaciones para dicho producto sin leer, si es asi pone existComunication a true,
        //para mostrar o no el mensaje de iniciar comunicacion:
        this.checkExistsComunications(this.actual_patient, prescription.id);


        //cargamos la linea de prescripcion
        this.actual_prescription = prescription;


        //una vez sabemos el producto, asociamos los datos del prescriptor
        this.actual_prescriptor_dni = this.actual_prescription.profesional?.dni || '';
        this.actual_prescriptor_name = this.actual_prescription.profesional?.name || '';


        this.prescriptionStatus = prescription.status.code;
        this.chargeMessagesFromBBDD(this.patient);


        //comprobamos si para el estado del producto habilitamos o no el envio de mensajes


        this.lstPrescriptionStatus.includes(this.prescriptionStatus) ?
          this.desactiveCommunicationMessages = true : this.desactiveCommunicationMessages = false;


        //mostramos modal de comunicacion
        this.comunicationModal.show(this.desactiveCommunicationMessages);






        break;
      case PrescriptionActions.DETAILS:
        this.prescriptionDetails.emit(prescription);
        break;
      default:
        break;
    }
  }

  ////////////////////////////////*metodos comunicaciones*//////////////////////////

  /*
 Metodo que carga los mensajes de la BBDD
 */
  chargeMessagesFromBBDD(patient: SimplePatient) {



    const criteria = new FindComunicationCriteria;
    criteria.cipa = patient.cipa;




    this.comunicationDAOService.
      findComunication(
        criteria,
        this.comunicationDAOService.getUrl(
          this.comunicationDAOService.localUrl, this.comunicationDAOService.pathSearch))
      .pipe(
        tap((comunications: ComunicationsRS[]) => this.lstResultComunication = comunications))
      .subscribe();


    //si es la primera vez que se carga actualiza desde la BBDD, el resto de mensajes se iran añadiendo en local
    if (this.localLstResultComunication == undefined) {


      this.comunicationDAOService.
        findComunication(
          criteria,
          this.comunicationDAOService.getUrl(
            this.comunicationDAOService.localUrl, this.comunicationDAOService.pathSearch))
        .pipe(
          tap((localComunications: ComunicationMessageRS[]) => this.localLstResultComunication = localComunications))
        .subscribe();

    }



    this.localLstResultComunicationView = this.localLstResultComunication;


  }

  /*
      Metodo que refresca la pantalla de mensajes para las comunicaciones
  */
  refreshMessagesFromBBDD(patient: SimplePatient) {//refresca los mensajes cargados en local desde de la BBDD

    const criteria = new FindComunicationCriteria();
    criteria.cipa = patient.cipa;

    this.comunicationDAOService.
      findComunication(
        criteria,
        this.comunicationDAOService.getUrl(
          this.comunicationDAOService.localUrl, this.comunicationDAOService.pathSearch))
      .pipe(
        tap((localComunications: ComunicationMessageRS[]) => this.localLstResultComunication = localComunications))
      .subscribe();



  }

  /*

    Metodo que comprueba si existen comunicaciones

    */

  checkExistsComunications(patient: SimplePatient, requestGroupId: string) {



    this.existComunication = false;
    const existComunicationNumber = 0;
    const messageComunication = new ComunicationMessageRS();
    messageComunication.cipa = this.patient.cipa;
    messageComunication.requestgroupID = requestGroupId;


    this.comunicationDAOService.findIfExistsComunication(
      messageComunication,
      this.comunicationDAOService.getUrl(
        this.comunicationDAOService.localUrl, this.comunicationDAOService.pathIfExists))
      .pipe(
        tap((data: number) => this.activeStartComunication(data, requestGroupId)))

      .subscribe();




  }

  /*

  Metodo que activa o desactiva comenzar comunicaciones si no existen

  */

  activeStartComunication(comunication: number, requestGroupId: string) {



    this.existComunicationInBBDD = true;

    //comprueba si hay comunicaciones, si no las hay te muestra el mensaje de iniciarla
    if (comunication != 1) {



      //lo muestra porque no hay ningun tipo de mensaje
      this.existComunicationInBBDD = false;






    }

    //veo si en el listado de comunicaciones cargado hay alguna referente al producto en curso, si lo hay lo vuelvo a poner a true

    for (const mensaje of this.localLstResultComunicationView) {

      if (mensaje.requestgroupID === requestGroupId) {

        this.existComunicationInBBDD = true;


      }

    }


  }


}
