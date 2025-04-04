import { DatePipe } from "@angular/common";
import { inject, Injectable } from "@angular/core";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable } from "rxjs";
import { SimplePatient } from "src/app/bean/models/patient";
import { PrescriptionRow } from "src/app/bean/models/prescription";
import { CustodiaService } from "../custodia/custodia.service";



@Injectable({
  providedIn: 'root'
})
export class NoWacomService {


//imagenes
public images = {
  line: 'data:image/jpeg;base64,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'
}

  private patient = 'Datos paciente';
  private dispensigCenter = '';
  private prescription: PrescriptionRow[] = [];

  myImage!:  Observable<any>;
  base64code!: any;

    /*
    tratamiento de fechas
  */
    public today = new Date();
    public actualDate!: string;
    public pipe = new DatePipe('es-ES');



    constructor(private custodiaService: CustodiaService){}

    public createPdf(patient: SimplePatient | undefined, dispensingCenter: String | undefined, prescriptions: PrescriptionRow[], totalImporte: number){

      this.patient = patient?.fullname + ',CIPA: ' + patient?.cipa;
      this.actualDate = this.formatFullDate(this.today);
      this.dispensigCenter = dispensingCenter + ''; 



     
      //inicio docDefinition
      const docDefinition = {

            content: [


              {style: 'header',
                table: {
                  body: [['.                  PRODUCTOS DISPENSADOS                  .']]
                }
                
              },

              {text: 'Paciente:', style: 'bold'} , this.patient,
              {text: 'Establecimiento: ', style: 'bold'}, this.dispensigCenter,
              {text: 'Fecha Dispensacion: ', style: 'bold'}, this.actualDate,

                {

                  image: this.images.line,  width: 150, height: 50 
                              
                }
 
            ],
            styles: {
              header: {
                fontSize: 18,
                bold: true,
                margin: 50
              },
              tableExample: {
                margin: 10
              },
              bold: {
                bold: true
              }
            },
            defaultStyle: {
              //alignment: 'justify'
            }
 

      } //fin docDefinition


      docDefinition.content.push(this.getPrescriptionDefinition(prescriptions,totalImporte));
      docDefinition.content.push('Firma Paciente');
     


        const pdf = pdfMake;
        pdf.vfs = pdfFonts.pdfMake.vfs;

        


        pdf.createPdf(docDefinition).open();

      

        pdfMake.createPdf(docDefinition).getBase64((data)=>{
          
          
            //envio de documento a custodia SIAVAL
            this.custodiaService.sendDispensationDocument(data,prescriptions).subscribe(data => {
        
                if(!data){
                  console.log("Fallo en el envio documento custodia");
                  
                }
            });
        
        });
      

  }


        //metodo que devuelve la tabla de prescripciones
        getPrescriptionDefinition(prescriptions: PrescriptionRow[],totalImporte:number) {

          totalImporte = 0;
    
          const prescriptionTable = {
            
              style: 'tableExample',
              table: {
                body: [
                  ['Cod-Descripción producto', 'Prescriptor(CPF)', 'Núm. Productos','Precio de facturación (TOTAL €)', 'Aportación(€)'],
                ]
          }};
      
          prescriptions.forEach ((prescription) =>
            
            {

              prescription.products.forEach((product) =>

              {
              
              const newRow = [];


              newRow.push(product.code + '-' + product.description,
                          prescription.profesional?.name + '-' + prescription.profesional?.dni,
                          product.units.value.toString(),
                          product.pvp.value?.toString() || '0',
                          product.userConsideration.realAportation?.toString() || '0');
          
            

                          prescriptionTable.table.body.push(newRow);

              totalImporte += product.userConsideration.realAportation || 0;
                          

              })
            
            
            
            });

            prescriptionTable.table.body.push(['TOTAL', '', '','',totalImporte.toString()]);
      
          return prescriptionTable;
      
      
      }


/**
   * Función formatea una fecha a un string del tipo 'dd/MM/yyyy HH:mm:ss'
   * @param date
   */
private formatFullDate(date: Date): string {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hour = d.getHours(),
    mins = '' + d.getMinutes(),
    secs = '' + d.getSeconds();
    

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  if (mins.length < 2)
    mins = '0' + mins;
  if (secs.length < 2)
    secs = '0' + secs;

  return [day, month, year].join('/') + [" "] + [hour,mins,secs].join(':');
}


      }