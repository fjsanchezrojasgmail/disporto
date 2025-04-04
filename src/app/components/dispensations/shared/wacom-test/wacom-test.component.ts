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
import { SimplePatient } from 'src/app/bean/models/patient';
import { BehaviorSubject } from 'rxjs';
import { Image } from 'primeng/image';

@Component({
  selector: 'sacyl-wacom-test',
  templateUrl: './wacom-test.component.html',
  styleUrls: ['./wacom-test.component.css']
})
export class WacomTestComponent implements OnInit{

  @Input() title!: string;
  @Input() context!: string;
  @Input() prescriptionDetails!: EventEmitter<Prescription>;

  @Output() confirm: EventEmitter<Boolean | undefined> = new EventEmitter<Boolean | undefined>()

  patientService?: PatientService;
  profesionalService?: ProfesionalService;
  signatureState: String = 'ESPERANDO FIRMA';
  imgUrl = "assets/images/avatars/fondo_firma.png";
  signatureUrl = "assets/images/avatars/info.png";


  disableCancel = false;
  disableConfirm = true;
  disableCapture = false;
  disableCreate = true;
  dispensed = false;

  

  display = false;
  constructor(private wacomService: WacomService){}

  prescriptions: PrescriptionRow[] = [];
  
  patient?: SimplePatient;
  //paciente: string = 'Nombre Apellidos, CIPA: 0000000, Total: 100€';
  paciente: string | undefined;
  dispensingCenter: string | undefined;
  totalImporte = 0

  @ViewChild('captureSignature') imgCapture: ElementRef | undefined;

  ngOnInit(): void {

  }

  show(prescriptions: PrescriptionRow[],patient?: SimplePatient,dispensingCenter?: string, importeTotal?: number) {
    this.display = true;
    this.prescriptions = prescriptions;
    this.patient = patient;
    this.dispensingCenter = dispensingCenter;
    this.totalImporte = importeTotal?importeTotal:0;
    this.paciente = this.patient?.fullname + ',CIPA: ' + this.patient?.cipa + ',Total: ' + importeTotal;
    this.imgUrl = "assets/images/avatars/fondo_firma.png";
    this.disableConfirm = true;
   
  }

  confirmSignature() {
    //this.confirm.emit(this.prescription);
   
     //una vez firmado se termina de dispensar
     this.dispensed = true;
     this.imgUrl = "assets/images/avatars/fondo_firma.png";
     this.confirm.emit(this.dispensed);
     this.display = false;

  }
  captureSignature(){
   
    this.clearImg()
    //desactivamos cancelar,aceptar y crear pdf y cerrar ventana
    this.disableCancel = false;
    this.disableConfirm = true;
    this.disableCreate = true;
    //solicitamos la firma
    //WacomUtil.tabletDemo(this.paciente);

    //simulamos la captura de la firma
    this.imgUrl = this.signatureUrl;

    
  }
  createPdf(captureSignature: any){
    
  
    //habilitamos aceptar y sale pdf
    this.disableConfirm = false;
    //this.wacomService.createPdf(captureSignature, this.patient, this.dispensingCenter,this.prescriptions,this.totalImporte);

  }


  updateState(event: Event){
   
    let image = event.target as HTMLImageElement;
    if(image.src.indexOf(this.imgUrl) > 1){
      this.signatureState = "ESPERANDO FIRMA";
    }else{
      this.disableCancel = true;
      this.disableConfirm = true;
      this.disableCreate = false;
      this.signatureState = "CAPTURADA";
    }
    
  }
  clearImg(){
    //signatureImage.src="assets/images/avatars/fondo_firma.png";
   
    this.signatureState = 'ESPERANDO FIRMA';
    this.imgUrl= "assets/images/avatars/fondo_firma.png";
  }
}
