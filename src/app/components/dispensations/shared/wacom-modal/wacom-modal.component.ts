import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Prescription, PrescriptionRow } from '../../../../bean/models/prescription';
//import * as WacomUtil  from 'wacom-util/lib/esm/wacomUtil';
import * as WacomUtil from './../../../../../assets/wacom/wacomUtil';
import { WacomService } from '../../../../services/helpers/wacom-service/wacom.service';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ProfesionalService } from '../../../../services/helpers/profesional/profesional.service';
import { PatientService } from '../../../../services/helpers/patient/patient.service';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { SimplePatient } from '../../../../bean/models/patient';
import { BehaviorSubject, Observable } from 'rxjs';
import { Image } from 'primeng/image';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'sacyl-wacom-modal',
  standalone: true,
  imports:[CommonModule, TranslateModule, DialogModule, ButtonModule],
  templateUrl: './wacom-modal.component.html',
  styleUrls: ['./wacom-modal.component.css']
})
export class WacomModalComponent implements OnInit {

  @Input() title!: string;
  @Input() context!: string;
  @Input() prescriptionDetails!: EventEmitter<Prescription>;

  @Output() confirm: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('captureSignature') imgCapture: ElementRef | undefined;



  patientService?: PatientService;
  profesionalService?: ProfesionalService;
  signatureState: string = 'ESPERANDO FIRMA';
  imgUrl = "assets/images/avatars/fondo_firma.png";
  signatureSimulated? : string;

  //comportamiento de botones
  disableCancel = false;
  disableCapture = false;
  disableCreate = true;

  dispensed = false;



  display = false;
  constructor(private wacomService: WacomService) {
    this.signatureSimulated = this.wacomService.images.line;
   }

  prescriptions: PrescriptionRow[] = [];

  patient?: SimplePatient;
  //paciente: string = 'Nombre Apellidos, CIPA: 0000000, Total: 100€';
  paciente: string | undefined;
  dispensingCenter: string | undefined;
  totalImporte = 0;





  ngOnInit(): void {
    //
  }

  show(prescriptions: PrescriptionRow[], patient?: SimplePatient, dispensingCenter?: string, importeTotal?: number) {
    this.display = true;
    this.prescriptions = prescriptions;
    this.patient = patient;
    this.dispensingCenter = dispensingCenter;
    this.totalImporte = importeTotal ? importeTotal : 0;
    this.paciente = this.patient?.fullname + ',CIPA: ' + this.patient?.cipa + ',Total: ' + importeTotal;
    //this.imgUrl = 'assets/images/avatars/fondo_firma.png';
  }

  confirmSignature(pdfbase64: string) {
    //this.confirm.emit(this.prescription);

     //una vez firmado se termina de dispensar
     this.dispensed = true;
     this.confirm.emit(pdfbase64);
     this.disableCapture = false;
     this.display = false;
     //this.imgUrl = 'assets/images/avatars/fondo_firma.png';

  }
  captureSignature(){

    this.clearImg();
    //desactivamos cancelar,aceptar y crear pdf y cerrar ventana
    this.disableCancel = true;
    this.disableCapture = true;
    this.disableCreate = true;
    //solicitamos la firma
    WacomUtil.tabletDemo(this.paciente);

    //metodo para trabajar sin la wacom
    //this.updateState_()

  }
  createPdf(captureSignature: any){

    const base64Pdf = this.wacomService.createPdf(this.patient, this.dispensingCenter,this.prescriptions,this.totalImporte,captureSignature);
    setTimeout(()=>{

      this.wacomService.currentBase64Pdf$.subscribe(data=>{


        if(data){
          this.confirmSignature(data);
        }

      })

    },100);

    //this.clearImg();
    //WacomUtil.close();

  }

  updateState_(){

      this.disableCancel = false;
      this.disableCapture = true;
      this.disableCreate = false;
      this.signatureState = "CAPTURADA";
      this.imgUrl = this.signatureSimulated!;

  }


  updateState(event: Event){


    let image = event.target as HTMLImageElement;
    if(image.src.indexOf(this.imgUrl) > 1){
      this.disableCapture = false;
      this.signatureState = "ESPERANDO FIRMA";
    }else{
      this.disableCancel = true;
      this.disableCapture = true;
      this.disableCreate = false;
      this.signatureState = "CAPTURADA";
    }

  }
  clearImg() {
    //signatureImage.src="assets/images/avatars/fondo_firma.png";

    this.signatureState = 'ESPERANDO FIRMA';
    this.imgUrl = 'assets/images/avatars/fondo_firma.png';
  }
  onHide(){

    this.clearImg();
    //WacomUtil.close();
  }
  closeModal(){

    this.display = false;
  }
}
