import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HttpService } from '../../http.service';
import { Constants } from '../../../bean/models/constant';
import { Constant } from '../../../bean/simple.types';

@Injectable({ providedIn: 'root' })

export class ConstantsService{

 public pathSearch = '/rest/constante/adm/search'; // URL buscar constante

 private constant = {
    code: '',
    description: '',
    value: ''
  };


  public localUrl = 'http://localhost.indra.es:8085/hnanexo';
  public remoteUrl = 'http://ortosacyl.indra.es/hnanexo';

  constructor(
    private http: HttpService) {
  }



  getUrl(url: string, path: string): string {
    return this.remoteUrl + path;
  }


  findConstants(constantString: string): Observable<any> {

    this.constant.code = constantString;
 
    return of(this.constantes);

    /*return this.http.post<Constants, Constants>(this.pathSearch, this.constant).pipe(map(value => {
      if (value) return value;
      return [];
    }));*/

  }

  private constantes: Constants[] = [
    {
      "code": "MESES_FACTURACION",
      "description": "Número de meses máximo que se permite desde la dispensación hasta la facturación",
      "value": "2"
    },
    {
      "code": "T_HISTORICO",
      "description": "Tiempo de consulta para el histórico de prescripciones de un paciente por defecto (en años)",
      "value": "2"
    },
    {
      "code": "T_HISTORICO_MAXIMO",
      "description": "Tiempo de consulta máximo para el histórico de prescripciones de un paciente (en años)",
      "value": "4"
    },
    {
      "code": "MODIF_DISPENSACION",
      "description": "Tiempo en horas para deshacer una dispensación realizada",
      "value": "24"
    },
    {
      "code": "MODIF_RESERVA",
      "description": "Tiempo en horas para deshacer una reserva realizada",
      "value": "24"
    },
    {
      "code": "MODIF_BLOQUEO_CAUTELAR",
      "description": "Tiempo en horas para deshacer un bloqueo cautelar realizado y pendiente de gestionar",
      "value": "24"
    },
    {
      "code": "PORC_DISCAPACIDAD",
      "description": "Valor a superar para identificar si dispone una resolución de discapacidad. (porcentaje)",
      "value": "33"
    },
    {
      "code": "MARCA_COMERCIAL",
      "description": "Habilitado o deshabilitado el circuito de la marca comercial. S: Habilitado y N: Deshabilitado",
      "value": "N"
    },
    {
      "code": "FECHA_MAX_VIGENCIA",
      "description": "Fecha de máxima vigencia (en días, por defecto 30)",
      "value": "90"
    },
    {
      "code": "FECHA_MAX_DISPENSA",
      "description": "Fecha máxima de dispensación (en meses, por defecto 12)",
      "value": "12"
    },
    {
      "code": "FECHA_MAX_REEMB",
      "description": "Fecha máxima de reembolso (en meses, por defecto 12)",
      "value": "0"
    },
    {
      "code": "MAX_VIDA_ELAB",
      "description": "Fecha máxima de vida de prescripciones con estado EN BORRADOR (en días, por defecto 15)",
      "value": "15"
    },
    {
      "code": "WACOM_ESTADO",
      "description": "En dispensación tener activada (1) o desactivada (0) la Wacom para la firma digital",
      "value": "0"
    },
    {
      "code": "FECHA_VIGENCIA_SUP",
      "description": "Fecha de vigencia máxima, para cuando el facultativo requiere realizar una acción (días)",
      "value": "365"
    }
  ];

}
