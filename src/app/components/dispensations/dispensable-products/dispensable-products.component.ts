import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { combineLatest, Observable, map } from 'rxjs';
import { BlockEvent, WacomStateType } from '../../../bean/simple.types';
import { AtnaRegistrationConstants, PrescriptionActions } from '../../../bean/constants';
import { SimplePatient } from '../../../bean/models/patient';
import { Prescription, PrescriptionRow } from '../../../bean/models/prescription';
import { DispensableProductsService } from '../../../services/dedicated/prescription/dispensable-products.service';
import { BlockModalComponent } from '../shared/block-modal/block-modal.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { WacomModalComponent } from '../shared/wacom-modal/wacom-modal.component';
import { Product } from '../../../bean/models/product';
import { ComunicationModalComponent } from '../shared/comunication-modal/comunication-modal.component';
import { FindComunicationCriteria } from '../../../bean/models/findComunication-criteria';
import { ComunicationsRS } from '../../../bean/models//comunications.bean';
import { ComunicationMessageRS } from '../../../bean/models//comunication-message.bean';
import { Constants } from '../../../bean/models//constant';
import { ComunicationDAOService } from '../../../services/dao/comunication-dao.service';
import { NotificationDAOService } from '../../../services/helpers/notification/notification-dao.service';
import { tap } from 'rxjs/operators';
import { ProfesionalAdm } from '../../../bean/models/profesional';
import { ProfesionalService } from '../../../services/helpers/profesional/profesional.service';
import { NotificationMessageRS } from '../../../bean/models//notification-message.bean';
//import { WacomState } from '../../../bean/constants';
//import { NoWacomService } from '../../../services/helpers/wacom-service/nowacom.service';
import { AtnaRegistrationService } from '../../../services/helpers/auditoria/atna-registration.service';

import { ConstantsService } from '../../../services/helpers/constants/constants.service';
import { Patient } from '../../../bean/fhir-r3/domain/interfaces/patient.interface';
import { PatientModel } from '../../../bean//fhir-r3/domain/patient';
import { ConfigService } from '../../../services/config.service';
import { initialConfigProperties } from '../../../bean/config';
import { WacomService } from '../../../services/helpers/wacom-service/wacom.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule, TableRowExpandEvent } from 'primeng/table';
import { PrescriptionObservationIconsComponent } from '../shared/prescription-observation-icons/prescription-observation-icons.component';
import { PaginatorModule } from 'primeng/paginator';
import { NoResultsComponent } from '../../shared/no-results/no-results.component';
import { HistoricalFilterComponent } from '../historical/historical-filter/historical-filter.component';
import { ProductObservationIconComponent } from '../shared/product-observation-icon/product-observation-icon.component';
import { ProductAportationComponent } from '../shared/product-aportation/product-aportation.component';
import { BlockIconComponent } from '../shared/block-icon/block-icon.component';
import { LateralityComponent } from '../shared/laterality/laterality.component';
import { DefaultTextPipe } from '../../../pipes/default-text.pipe';
import { ApprovalIconComponent } from '../shared/approval-icon/approval-icon.component';
import { ActionsMenuButtonComponent } from '../shared/actions-menu-button/actions-menu-button.component';
import { UnitsInputComponent } from '../shared/units-input/units-input.component';
import { ProductDescriptionComponent } from '../shared/product-description/product-description.component';
import { PrescriptionStatusComponent } from '../shared/prescription-status/prescription-status.component';
import { RevisionIconComponent } from '../shared/revision-icon/revision-icon.component';
import { PvpInputComponent } from '../shared/pvp-input/pvp-input.component';
import { SidebarModule } from 'primeng/sidebar';
import { ApplicationRowSelectorComponent } from '../shared/application-row-selector/application-row-selector.component';
import { BrandIconComponent } from '../shared/brand-icon/brand-icon.component';
import { PrescriptionDescriptionComponent } from '../shared/prescription-description/prescription-description.component';
import { BrandSelectorComponent } from '../shared/brand-selector/brand-selector.component';
import { Establishment } from '../../../bean/models/administration';



@Component({
  selector: 'sacyl-products',
  standalone: true,
  imports: [
      CommonModule,
      TableModule,
      PaginatorModule,
      TranslateModule,
      NoResultsComponent,
      ComunicationModalComponent,
      ProductObservationIconComponent,
      ProductAportationComponent,
      ProductDescriptionComponent,
      PvpInputComponent,
      UnitsInputComponent,
      ActionsMenuButtonComponent,
      PrescriptionStatusComponent,
      PrescriptionObservationIconsComponent,
      PrescriptionDescriptionComponent,
      RevisionIconComponent,
      DefaultTextPipe,
      LateralityComponent,
      ApprovalIconComponent,
      BlockIconComponent,
      BlockModalComponent,
      ConfirmModalComponent,
      WacomModalComponent,
      SidebarModule,
      ApplicationRowSelectorComponent,
      BrandIconComponent,
      BrandSelectorComponent,
    ],
  templateUrl: './dispensable-products.component.html',
  styleUrls: ['./dispensable-products.component.css'],
  providers: []
})
export class DispensableProductsComponent implements OnInit {

  @Input() patient!: SimplePatient;

  /** comprobacion de si existen o no comunicaciones */
  @Input() existComunication!: boolean;

  @Input() dispensed!: boolean;

  @Output() prescriptionDetails: EventEmitter<Prescription> = new EventEmitter();

  actual_patient!: SimplePatient;
  patientCipa!: string | undefined;
  actual_profesional_user_id!: string;
  actual_profesional_user_name!: string;
  actual_profesional_center!: string;
  actual_profesional_center_code!: string;
  actual_prescriptor_dni!: string;
  actual_prescriptor_name!: string;
  actual_product_code!: string;
  actual_requestGroup!: string;
  actual_dispensing_center_code!: string;
  actual_dispensing_center_name!: string;
  prescriptionStatus!: string;
  blockedPrescription!: PrescriptionRow;
  profesional?: ProfesionalAdm;
  urlDisportoreq!: string;// Url a la que se van a hacer peticiones FHIR via disporto
  urlAnexoreq!: string;// Url a la que se van a hacer peticiones FHIR via anexo


  @Output() actual_prescription!: PrescriptionRow;

  /** comprobacion de si existen o no comunicaciones en el menu action */
  @Output() menuActionIfExistComunicationInBBDD!: boolean;

  @Output() localLstResultComunicationView!: ComunicationMessageRS[];

  @ViewChild(BlockModalComponent) blockModal!: BlockModalComponent;

  @ViewChild(ComunicationModalComponent) comunicationModal!: ComunicationModalComponent;

  @ViewChild(ConfirmModalComponent) reserveModal!: ConfirmModalComponent;


  @ViewChild(WacomModalComponent) wacomModal!: WacomModalComponent;


  productBrandSelection?: PrescriptionRow;

  prescriptions$: Observable<PrescriptionRow[]>;

  profesional$: Observable<ProfesionalAdm>;

  center$: Observable<Establishment>;

  mockPrescriptions?: PrescriptionRow[];

  expandedRowKeys: Record<string, boolean> = {};

  singleton = true;

  loading = false;

  profesional_user_id!: string;
  dispensing_center_code!: string;
  dispensing_center_name!: string;
  finalPrescriptions!: PrescriptionRow[];


  //******************/
  wacomState: boolean = false;
  constants!: Constants[];
  constant!: Constants;
  wacomStateType!: WacomStateType;
  wacomString: string = 'WACOM_ESTADO';
  prescriptionState: string = 'DISPENSED'
  //******************/


  //existMenuComunication!: boolean;

  /** comprobacion de si existen o no comunicaciones en BBDD */
  existComunicationInBBDD!: boolean;

  product_code!: string;

  /*Informacion de las comunicaciones*/

  public comunicationCriteria!: FindComunicationCriteria;
  public comunicationRS!: ComunicationsRS;

  /*
   Datos de las comunicaciones para la opcion del menu
 */
  lstResultComunication!: ComunicationsRS[];
  localLstResultComunication!: ComunicationMessageRS[];
  lstPrescriptionStatus: string[] = ['ANULADA', 'PRESCDISPENSADA', 'ANULADABLOQUEOCAUTELAR', 'BLOQUEOCAUTELARADMITIDO', 'PRESCBLOQUEOCAUTELAR'];
  desactiveCommunicationMessages!: boolean;

  constructor(
    private profesionalService: ProfesionalService,
    private dispensableProductService: DispensableProductsService,
    private comunicationDAOService: ComunicationDAOService,
    private notificationDAOService: NotificationDAOService,
    private wacomService: WacomService,
    private atnaRegistrationService: AtnaRegistrationService,
    private constantsService: ConstantsService,
    private cdRef: ChangeDetectorRef,
  ) {


    this.prescriptions$ = this.dispensableProductService.prescriptions$;
    this.profesional$ = this.profesionalService.getProfesional();
    this.center$ = this.profesionalService.getEstablishment();

  
    

  }

  /*ngOnInit(): void {


    this.dispensableProductService.fetchDispensableProducts(this.patient);

    this.dispensableProductService.loading$.subscribe(data => this.loading = data);
    this.prescriptions$.subscribe(data => {
      if(data){
        data.map(
          p => this.expandedRowKeys[p.id] = p.expanded
        )
          this.actual_prescriptor_dni = data[0].profesional?.dni || '',
          this.actual_prescriptor_name = data[0].profesional?.name || ''
    }
      
      
    });


    this.profesionalService.getProfesional().subscribe((profesional) =>{

      if(profesional){
        this.profesional_user_id = profesional.code!;
        this.actual_profesional_center = profesional.listEstablecimientos[0].centerName;
        this.actual_profesional_center_code = profesional.listEstablecimientos[0].code;
        this.actual_profesional_user_id = profesional.code!;
        this.actual_profesional_user_name = profesional.code!;
      }
    
    });

    this.profesionalService.getEstablishment().subscribe((Establishment) => {
      if(Establishment){
        this.actual_dispensing_center_code = Establishment.code;
        this.actual_dispensing_center_name = Establishment.centerName;

      }
    });

    this.cdRef.detectChanges(); // fuerza la actualización


    this.mockPrescriptions = this.dispensableProductService.getDispensableProductsRows();


    this.urlDisportoreq = initialConfigProperties.urlDisportoreq;
    this.urlAnexoreq = initialConfigProperties.urlAnexoreq;

    //cargamos datos de paciente y profesional logado
    this.actual_patient = this.patient;
    this.patientCipa = this.patient.cipa;

    //cargamos mensajes de la BBDD
    this.chargeMessagesFromBBDD(this.patient);

    //cargamos estado de la wacom
    this.checkWacom();

    
  }*/

    ngOnInit(): void {
      combineLatest([
        this.prescriptions$,
        this.profesional$,
        this.center$,
      ])
      .pipe(
        map(([prescriptions, profesional, center]) => {
          // ✅ Asignamos los valores como corresponda
          prescriptions.forEach(p => this.expandedRowKeys[p.id] = p.expanded);
    
          this.actual_prescriptor_dni = prescriptions[0]?.profesional?.dni || '';
          this.actual_prescriptor_name = prescriptions[0]?.profesional?.name || '';
    
          this.profesional_user_id = profesional.code!;
        this.actual_profesional_center = profesional.listEstablecimientos[0].centerName;
        this.actual_profesional_center_code = profesional.listEstablecimientos[0].code;
        this.actual_profesional_user_id = profesional.code!;
        this.actual_profesional_user_name = profesional.code!;

        this.actual_dispensing_center_code = center.code;
        this.actual_dispensing_center_name = center.centerName;

        })
      )
      .subscribe(() => {
        // ✅ Forzamos detección de cambios una vez
        setTimeout(() => this.cdRef.detectChanges());
      });



      this.mockPrescriptions = this.dispensableProductService.getDispensableProductsRows();


    this.urlDisportoreq = initialConfigProperties.urlDisportoreq;
    this.urlAnexoreq = initialConfigProperties.urlAnexoreq;

    //cargamos datos de paciente y profesional logado
    this.actual_patient = this.patient;
    this.patientCipa = this.patient.cipa;

    //cargamos mensajes de la BBDD
    this.chargeMessagesFromBBDD(this.patient);

    //cargamos estado de la wacom
    this.checkWacom();


    }


  showProducts($event: TableRowExpandEvent & { data: PrescriptionRow }) {
    this.dispensableProductService.expandProducts($event.data.id);
  }

  softSave(prescriptions: PrescriptionRow[]) {
    this.dispensableProductService.savePrescriptionRows(prescriptions);
  }

  dispend(prescriptions: PrescriptionRow[]) {
    const treatablePrescriptions: PrescriptionRow[] = prescriptions.filter(p => p.consider);
    if (!this.dispensableProductService.validatePrescriptions(treatablePrescriptions)) {

      this.finalPrescriptions = treatablePrescriptions;
      const notPayed = treatablePrescriptions.filter(p => !p.payed);

      if (this.wacomState && notPayed.length > 0) {
        //vamos con la firma a traves de la wacom
        console.log("Realizamos la dispensacion con la wacom");
        this.dispendWacom(notPayed);
      } else {
        //sacamos informe directamente sin firmar
        console.log("Realizamos la dispensacion sin la wacom");
        this.finalizeDispensation(treatablePrescriptions);
      }
    }
  }

  checkWacom(){

    this.constantsService.findConstants(this.wacomString).subscribe(data=>{
      if(data){

        if(data[0].value == 1){
            console.log("WACOM ACTIVA");
            this.wacomState = true;
        }else {
          console.log("WACOM NO ACTIVA");
        }

      }
    });

  }

  dispendWacom(prescriptions: PrescriptionRow[]) {

    const treatablePrescriptions: PrescriptionRow[] = prescriptions.filter(p => p.consider);

    //recorrer prescripciones obtener productos, recorrer estos y obtener la aportacion real.
    //los productos no dispensables no deben aportar cantidad (propiedad consider)
    //generamos informe con los datos de la dispensación sin la firma


    let finalAportation = 0;
    let precioProductos = 0;
    let importeTotal = 0;


    //this.listPrescriptions.forEach((prescription) =>{

    treatablePrescriptions.forEach((prescription) => {

      prescription.products.forEach((product) => {

        precioProductos += Number(product.pvp.total);
        finalAportation += Number(product.userConsideration.realAportation);

      });
    });

    importeTotal = finalAportation;

    const dispensingCenter = this.profesionalService.secureEstablishment.centerName + ' - ' + this.profesionalService.secureEstablishment.code;
    //this.wacomModal.show(prescriptions,this.patient,dispensingCenter);
    this.wacomModal.show(treatablePrescriptions, this.patient, dispensingCenter, importeTotal);


  }

  captureSignature(pdfbase64: string) {
    this.finalizeDispensation(this.finalPrescriptions, pdfbase64);
  }

  finalizeDispensation(treatablePrescriptions: PrescriptionRow[], pdfbase64?: string) {


    const notPayed = treatablePrescriptions.filter(p => !p.payed);

    //Solo imprimir al dispensar las no pagadas y la wacom no esta habilitada

     if (notPayed.length > 0 && !this.wacomState) {
      const dispensingCenter = this.profesionalService.secureEstablishment.centerName + ' - ' + this.profesionalService.secureEstablishment.code;

      //Se lanza pdf con todas las prescripciones
      this.wacomService.createPdf(this.patient, dispensingCenter, notPayed, this.totalAportation(notPayed));

    }

    //recorremos el array de prescripciones para dispensar
    for (const prescription of treatablePrescriptions) {


      //si está pendiente de revisión o la revision tiene estado rechazado creamos notificacion
      if (prescription.revision?.required || prescription.revision?.display === 'Rechazada') {

        //NOTIFICACION

        const newNotificationMessage = new NotificationMessageRS();

        newNotificationMessage.prescriptorDNI = prescription.profesional?.dni;//dni del prescriptor
        newNotificationMessage.prescriptorName = prescription.profesional?.name;//nombre del prescriptor
        newNotificationMessage.originServiceCode = prescription.prescribingCenter?.code;//codigo centro
        newNotificationMessage.originServiceDesc = prescription.prescribingCenter?.display;//descripcion servicio
        newNotificationMessage.notificationType = 'DTN004';
        newNotificationMessage.originEstablishment = this.actual_dispensing_center_code;//codigo_centro
        newNotificationMessage.centerDesc = this.actual_profesional_center;//descripcion_centro
        newNotificationMessage.requestGroup = prescription.id;//elemento o producto
        newNotificationMessage.cipa = this.patient.cipa;//cipa paciente
        newNotificationMessage.patientName = this.patient.fullname;//nombre paciente
        newNotificationMessage.read = 'N';//leido S/N
        newNotificationMessage.readUserID = 'ID_lectura';//id usuario lectura
        newNotificationMessage.readUserDesc = 'description';//descripcion usuario lectura
        newNotificationMessage.readCenterCode = 'CODE';//codigo centro lectura
        newNotificationMessage.readCenterDesc = 'description';//descripcion centro lectura
        newNotificationMessage.readServiceDoctorCode = 'CODE';//codigo servicio usuario lectura
        newNotificationMessage.readServiceDoctorDesc = 'description';//descripcion servicio usuario lectura

        //insertamos notificacion en la tabla notificaciones
        this.notificationDAOService.createNotification(newNotificationMessage, this.notificationDAOService.getUrl(
          this.notificationDAOService.localUrl, this.notificationDAOService.pathResourceCreate)).subscribe();



      }

      //****************************Creacion de registro de auditoria por prescripcion dispensada**********************************/
      /* this.createRegAtna(
        prescription, AtnaRegistrationConstants.SUBTYPE_CODE_DISPENSE_PRESCRIPTION,
        AtnaRegistrationConstants.SUBTYPE_DISPLAY_DISPENSE_PRESCRIPTION); */

    }

    setTimeout(() => {
      this.wacomService.currentBase64Pdf$.subscribe(data => {
        //metodo de finalizacion de la dispensacion
        console.log("Se dispensa: ", data);

        this.dispensableProductService.dispensePrescription(treatablePrescriptions, this.patient, data || undefined);
      });
    }, 100);


  }

  createRegAtna(prescription: Prescription, auditCode: string, auditDisplay: string) {

    //****************************Creacion de registro de auditoria por prescripcion dispensada**********************************//


    // Montamos la acción
    const actionModificationSSCCPrescription = {
      action: AtnaRegistrationConstants.ACTION_CREATE,
      code: auditCode,
      display: auditDisplay
    };


    // Montamos array con los recursos implicados (RequestGroup, Patient y practitioner(el que realiza la acción))
    const arrResources = [];
    arrResources.push(prescription.id, this.patient, this.actual_profesional_center);

    // Llamamos service
    this.atnaRegistrationService.callAuditCreate(
      arrResources,
      this.patient,
      actionModificationSSCCPrescription,
      this.urlDisportoreq
      //this.urlAnexoreq
    );


  }


  menuAction(prescription: PrescriptionRow, action: PrescriptionActions) {

    this.product_code = prescription.products[0].code;
    this.actual_product_code = prescription.products[0].code;



    switch (action) {
      case PrescriptionActions.DETAILS:
        this.prescriptionDetails.emit(prescription);
        break;
      case PrescriptionActions.COMMUNICATE:



        //comprobamos si hay comunicaciones para dicho producto sin leer,
        //si es asi pone existComunication a true, para mostrar o no el mensaje de iniciar comunicacion:
        this.checkExistsComunications(this.actual_patient, prescription.id);


        //una vez sabemos el producto, asociamos los datos del prescriptor
        this.actual_prescriptor_dni = prescription.profesional?.dni || '';
        this.actual_prescriptor_name = prescription.profesional?.name || '';



        //cargamos la linea de prescripcion
        this.actual_prescription = prescription;
        this.prescriptionStatus = prescription.status.code;
        this.actual_requestGroup = prescription.id;
        this.chargeMessagesFromBBDD(this.patient);


        //comprobamos si para el estado del producto habilitamos o no el envio de mensajes

        this.lstPrescriptionStatus.includes(this.prescriptionStatus) ?
          this.desactiveCommunicationMessages = true : this.desactiveCommunicationMessages = false;


        //mostramos modal de comunicacion
        this.comunicationModal.show(this.desactiveCommunicationMessages);



        break;
      case PrescriptionActions.BLOCK:
        this.blockModal.show(prescription);
        this.blockedPrescription = prescription;
        break;
      case PrescriptionActions.RESERVE:
        this.reserveModal.show(prescription);
        break;
      case PrescriptionActions.SET_BRAND:
        this.selectBrands(prescription);
        break;
      default:
        break;
    }
  }

  blockPrescription(event: BlockEvent) {


    this.dispensableProductService.blockPrescription(this.patient, event);


    //crear notificacion con el bloqueo cautelar de la prescripcion - DTN002
    //Creamos notificacion bloqueo cautelar:

    //NOTIFICACION

    const newNotificationMessage = new NotificationMessageRS();

    newNotificationMessage.prescriptorDNI = this.blockedPrescription.profesional?.dni;//dni del prescriptor
    newNotificationMessage.prescriptorName = this.blockedPrescription.profesional?.name;//nombre del prescriptor
    newNotificationMessage.originServiceCode = this.blockedPrescription.service?.code;//codigo centro
    newNotificationMessage.originServiceDesc = this.blockedPrescription.service?.display;//descripcion servicio
    newNotificationMessage.notificationType = 'DTN002';
    newNotificationMessage.originEstablishment = this.actual_profesional_center_code;//codigo_centro
    newNotificationMessage.centerDesc = this.actual_profesional_center;//descripcion_centro
    newNotificationMessage.requestGroup = this.blockedPrescription.id;//elemento o producto
    newNotificationMessage.cipa = this.patient.cipa;//cipa paciente
    newNotificationMessage.patientName = this.patient.fullname;//nombre paciente
    newNotificationMessage.read = 'N';//leido S/N
    newNotificationMessage.readUserID = 'ID_lectura';//id usuario lectura
    newNotificationMessage.readUserDesc = 'description';//descripcion usuario lectura
    newNotificationMessage.readCenterCode = 'CODE';//codigo centro lectura
    newNotificationMessage.readCenterDesc = 'description';//descripcion centro lectura
    newNotificationMessage.readServiceDoctorCode = 'CODE';//codigo servicio usuario lectura
    newNotificationMessage.readServiceDoctorDesc = 'description';//descripcion servicio usuario lectura

    //insertamos notificacion en la tabla notificaciones
    this.notificationDAOService.createNotification(newNotificationMessage, this.notificationDAOService.getUrl(
      this.notificationDAOService.localUrl, this.notificationDAOService.pathResourceCreate)).subscribe();

    //****************************Creacion de registro de auditoria**********************************//
    /*this.createRegAtna(this.blockedPrescription,
      AtnaRegistrationConstants.SUBTYPE_CODE_PRECAUTIONARY_BLOCKING,
      AtnaRegistrationConstants.SUBTYPE_DISPLAY_PRECAUTIONARY_BLOCKING);*/
  }

  disableDispensationButton(prescriptions: PrescriptionRow[]) {
    return prescriptions.every(p => p.consider === false);
  }

  totalAportation(prescriptions: PrescriptionRow[]) {
    let result = 0;
    prescriptions.forEach(p => {
      if (p.consider && !p.payed) result += Number(p.totalAportation);
    });
    return result;
  }

  openDetails(pres: Prescription) {
    this.prescriptionDetails.emit(pres);
  }

  reserve(pres?: Prescription) {

    if (pres) {

      this.dispensableProductService.reservePrescription(pres, this.patient);
      //****************************Creacion de registro de auditoria**********************************//
      // eslint-disable-next-line max-len
      //this.createRegAtna(pres, AtnaRegistrationConstants.SUBTYPE_CODE_RESERVE_DISPENSATION, AtnaRegistrationConstants.SUBTYPE_DISPLAY_RESERVE_DISPENSATION);

    }

  }



  disableDispensableRow(pres: Prescription) {
    return this.dispensableProductService.disableDispensableRow(pres);
  }

  selectBrands(prescription: PrescriptionRow) {
    this.productBrandSelection = prescription;
  }

  updateBrandProducts(prescription: PrescriptionRow, products: Product[]) {
    prescription.consider = true;
    this.dispensableProductService.updateProducts(prescription, products);
    this.closeBrands();
  }

  closeBrands() {
    this.productBrandSelection = undefined;
  }


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



    //this.checkExistsComunications(patientCipa);

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

    const criteria: FindComunicationCriteria = {
      cipa: patient.cipa
    };

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

  checkExistsComunications(patient: SimplePatient, RequestGroupId: string) {



    this.existComunication = false;
    const existComunicationNumber = 0;
    const messageComunication = new ComunicationMessageRS();
    messageComunication.cipa = this.patient.cipa;
    messageComunication.requestgroupID = RequestGroupId;


    this.comunicationDAOService.findIfExistsComunication(
      messageComunication,
      this.comunicationDAOService.getUrl(
        this.comunicationDAOService.localUrl, this.comunicationDAOService.pathIfExists))
      .pipe(
        tap((data: number) => this.activeStartComunication(data, RequestGroupId)))
      .subscribe();




  }

  /*

  Metodo que activa o desactiva comenzar comunicaciones si no existen

  */

  activeStartComunication(comunication: number, product_code: string) {


    this.existComunicationInBBDD = true;

    //comprueba si hay comunicaciones, si no las hay te muestra el mensaje de iniciarla
    if (comunication != 1) {

      //lo muestra porque no hay ningun tipo de mensaje
      this.existComunicationInBBDD = false;


    }

    //veo si en el listado de comunicaciones cargado hay alguna referente al producto en curso, si lo hay lo vuelvo a poner a true

    for (const mensaje of this.localLstResultComunicationView) {

      if (mensaje.requestgroupID === product_code) {

        this.existComunicationInBBDD = true;


      }

    }


  }




}
