import { Component, Input, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { PrescriptionRow } from '../../../../bean/models/prescription';
import { ProfesionalService } from '../../../../services/helpers/profesional/profesional.service';
import { FindComunicationCriteria } from '../../../../bean/models/findComunication-criteria';
import { ComunicationsRS } from '../../../../bean/models/comunications.bean';
import { ComunicationMessageRS } from '../../../../bean/models/comunication-message.bean';
import { ComunicationDAOService } from '../../../../services/dao/comunication-dao.service';

import { NotificationDAOService } from '../../../../services/helpers/notification/notification-dao.service';
import { tap } from 'rxjs/operators';
import { SimplePatient } from '../../../../bean/models/patient';
import { PrimitiveType } from 'fhir/r5';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { NotificationMessageRS } from '../../../../bean/models/notification-message.bean';



@Component({
  selector: 'sacyl-comunication-modal',
  standalone: true,
  imports: [CommonModule,DialogModule,TranslateModule,ButtonModule,FormsModule],
  templateUrl: './comunication-modal.component.html',
  styleUrls: ['./comunication-modal.component.css']
})
export class ComunicationModalComponent implements OnInit {

  @Input() title!: string;
  @Input() context!: string;
  @Input() prescriptionStatus!: string;
  @Input() actual_patient!: SimplePatient;
  @Input() actual_profesional_user_id!: string;
  @Input() actual_profesional_user_name!: string;
  @Input() actual_profesional_center!: string;
  @Input() actual_profesional_center_code!: string;
  @Input() actual_prescriptor_dni!: string;
  @Input() actual_prescriptor_name!: string;
  @Input() actual_prescription!: PrescriptionRow;
  @Input() actual_product_code!: string;
  @Input() actual_requestGroup!: string;
  @Input() actual_dispensing_center_code!: string;
  @Input() actual_dispensing_center_name!: string;
  @Input() existComunicationInBBDD!: boolean;
  @Input() localLstResultComunicationView!: ComunicationMessageRS[];


  //Modal para visualizar quien ha leido los mensajes con el check activo
  @ViewChild('dialogIfReadComunicationPrescriptionInList')
  dialogIfReadComunicationPrescriptionInList!: TemplateRef<any>;

  //Modal para visualizar quien ha leido los mensajes con el check activo
  @ViewChild('useridLogged')
  useridLogged!: PrimitiveType;





  display = false;
  read_visible = false;
  mensaje_leido!: string;
  texto_nuevoMensaje!: string;


  //prescription?: PrescriptionRow = this.actual_prescription;

  /*Informacion de las comunicaciones*/

  public comunicationCriteria!: FindComunicationCriteria;
  public comunicationRS!: ComunicationsRS;
  public desactiveCommunicationMessages = false;

  /*
   Datos de las comunicaciones para la opcion del menu
 */
  lstResultComunication!: ComunicationsRS[];

  lstPrescriptionStatus: string[] = ['ANULADA', 'PRESCDISPENSADA', 'ANULADABLOQUEOCAUTELAR', 'BLOQUEOCAUTELARADMITIDO', 'PRESCBLOQUEOCAUTELAR'];





  constructor(
    private profesionalService: ProfesionalService,
    @Inject('IComunicationDAOService') private comunicationDAOService: ComunicationDAOService,
    @Inject('INotificationDAOService') private notificationDAOService: NotificationDAOService
  ) { }


  ngOnInit() {


    this.actual_profesional_user_id = this.profesionalService.profesional.dni;
    this.actual_profesional_user_name = this.profesionalService.profesional.name;


  }

  show(active_desactive: boolean) {

    this.desactiveCommunicationMessages = active_desactive;
    //mostramos
    this.display = true;

  }

  //metodo que se ejecuta al dar a aceptar, si es campo está vacio solo refresca mensajes
  confirm() {


    if (this.texto_nuevoMensaje == undefined || this.texto_nuevoMensaje == '') {

      this.refreshMessagesFromBBDD(this.actual_patient);

    } else {

      //metodo que mete el mensaje en el array de mensajes y lo guarda en BBDD, también crea mensaje para notificaciones en prescripcion

      //COMUNICACION
      const newComunicationMessage = new ComunicationMessageRS();

      newComunicationMessage.originType = 'P';//prescriptor
      newComunicationMessage.date = new Date();//fecha_actual
      newComunicationMessage.centerCode = this.actual_dispensing_center_code;//codigo_centro
      newComunicationMessage.centerDesc = this.actual_dispensing_center_name;//descripcion_centro
      newComunicationMessage.serviceDoctorCode = this.actual_profesional_center_code;//codigo_servicio
      newComunicationMessage.serviceDoctorDesc = this.actual_profesional_center;//descripcion servicio
      newComunicationMessage.userID = this.actual_profesional_user_id;//id_usuario_logado
      newComunicationMessage.userDesc = this.actual_profesional_user_name ? this.actual_profesional_user_name : 'Centro Dispensador';//descripcion usuario
      newComunicationMessage.read = 'N';//leido S/N
      newComunicationMessage.readDate = new Date();//fecha_lectura
      newComunicationMessage.readCenterCode = 'CODE';//codigo centro lectura
      newComunicationMessage.readCenterDesc = 'description';//descripcion centro lectura
      newComunicationMessage.readServiceDoctorCode = 'CODE';//codigo servicio usuario lectura
      newComunicationMessage.readServiceDoctorDesc = 'description';//descripcion servicio usuario lectura
      newComunicationMessage.readUserID = 'ID_lectura';//id usuario lectura
      newComunicationMessage.readUserDesc = 'description';//descripcion usuario lectura
      newComunicationMessage.requestgroupID = this.actual_requestGroup;//elemento o producto
      newComunicationMessage.cipa = this.actual_patient.cipa;//cipa paciente
      newComunicationMessage.patientName = this.actual_patient.fullname;//nombre paciente
      newComunicationMessage.textMessage = this.texto_nuevoMensaje;//texto mensaje


      //almacenamos el nuevo mensaje en local
      this.localLstResultComunicationView.push(newComunicationMessage);

      //ocultamos el mensaje de no existen comunicaciones:
      this.existComunicationInBBDD = true;

      this.insertMessageInBBDD(newComunicationMessage);

      //refrescamos listado mensajes en pantalla

      //this.refreshMessagesFromBBDD(this.actual_patient);

      //vaciamos campo texto
      this.texto_nuevoMensaje = '';



      //NOTIFICACION

      const newNotificationMessage = new NotificationMessageRS();

      newNotificationMessage.prescriptorDNI = this.actual_prescriptor_dni;//dni del prescriptor
      newNotificationMessage.prescriptorName = this.actual_prescriptor_name;//nombre del prescriptor
      newNotificationMessage.originServiceCode = this.actual_dispensing_center_code;//codigo centro
      newNotificationMessage.originServiceDesc = this.actual_profesional_center;//descripcion servicio
      newNotificationMessage.notificationType = 'DTN001';
      newNotificationMessage.originEstablishment = this.actual_dispensing_center_code;//codigo_centro
      newNotificationMessage.centerDesc = this.actual_dispensing_center_name;//descripcion_centro
      newNotificationMessage.requestGroup = this.actual_requestGroup;//elemento o producto
      newNotificationMessage.cipa = this.actual_patient.cipa;//cipa paciente
      newNotificationMessage.patientName = this.actual_patient.fullname;//nombre paciente
      newNotificationMessage.read = 'N';//leido S/N
      newNotificationMessage.readUserID = 'ID_lectura';//id usuario lectura
      newNotificationMessage.readUserDesc = 'description';//descripcion usuario lectura
      newNotificationMessage.readCenterCode = 'CODE';//codigo centro lectura
      newNotificationMessage.readCenterDesc = 'description';//descripcion centro lectura
      newNotificationMessage.readServiceDoctorCode = 'CODE';//codigo servicio usuario lectura
      newNotificationMessage.readServiceDoctorDesc = 'description';//descripcion servicio usuario lectura


      //insertamos notificacion en la tabla notificaciones
      this.insertNotificationInBBDD(newNotificationMessage);

    }


  }

  /*
     Metodo que captura el mensaje en escrito en el campo del usuario y lo inserta en base de datos
 */
  insertMessageInBBDD(newComunicationMessage: ComunicationMessageRS) {

    this.comunicationDAOService.createComunication(newComunicationMessage, this.comunicationDAOService.getUrl(
      this.comunicationDAOService.localUrl, this.comunicationDAOService.pathResourceCreate)).subscribe();

  }

  insertNotificationInBBDD(newNotificationMessage: NotificationMessageRS) {

    this.notificationDAOService.createNotification(newNotificationMessage, this.notificationDAOService.getUrl(
      this.notificationDAOService.localUrl, this.notificationDAOService.pathResourceCreate)).subscribe();

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
        tap((localComunications: ComunicationMessageRS[]) => this.localLstResultComunicationView = localComunications))
      .subscribe();




  }

  /*
Metodo que visualiza quien ha leido el mensaje

*/
  openDialogReadMessage(comunicacion: ComunicationMessageRS) {

    //let shortDate: string = this.formatFullDate(comunicacion.readDate);
    //comunicacion.readDate.toDateString();

    this.mensaje_leido = comunicacion.readDate + ' : ' + comunicacion.readUserDesc + ' - ' +
      comunicacion.readCenterDesc + ' - ' + comunicacion.readServiceDoctorDesc;


    this.read_visible = true;

  }

  closeDialogReadMessage() {

    this.read_visible = false;

  }


}