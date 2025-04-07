import { inject, Injectable } from "@angular/core";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable } from "rxjs";
//import imageToBase64 from 'image-to-base64/browser";




@Injectable({
  providedIn: 'root'
})
export class PdfService {


    //images
  private IMGSacyl: string | undefined;
  private IMGJcyl: string | undefined;
  private sacylPath = 'assets/img/logo_sacyl.png';
  private jcylPath = 'assets/img/logo_jcyl.png';
  private format64 = 'data:image/png;base64,';

  myImage!:  Observable<any>;
  base64code!: any;



    constructor(){}

    public createPdf(captureSignature: any){

        const docDefinition = {

            content: [

            /* {
              image: this.IMGSacyl
            },
            {
              image: this.IMGJcyl
            },  */

              'Firma paciente: Nombre y apellidos, CIPA, Importe total: 100€',

                {
                  image: captureSignature,width: 150,height: 150
                              
                }

            ]


        }

        const pdf = pdfMake;
        pdf.vfs = pdfFonts.pdfMake.vfs;

        

          pdf.createPdf(docDefinition).open();
        }


//Usa la librería imageToBase64 para convertir las imágenes en base64 y que así las entienda PDFMake
/* public createAllIMG() {
  imageToBase64(this.sacylPath).then((data: string | undefined) => {
    this.IMGSacyl = data;
  });


  imageToBase64(this.jcylPath).then((data: string | undefined) => {
    this.IMGJcyl = data;
  });
}  */


      }