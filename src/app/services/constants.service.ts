import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BillingType, Constant, EstablishmentType, Justification, ProductType, ProfesionalType, Province } from '../bean/simple.types';
import { ConstantKeys } from '../bean/constants';
import { ComunicationMessageRS } from '../bean/models/comunication-message.bean';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  justifications: Justification[];
  blockMotives: Justification[];
  constants: Constant[];
  provinces: Province[];
  billingTypes: BillingType[];
  profesionalTypes: ProfesionalType[];
  establishmentTypes: EstablishmentType[];
  productTypes: ProductType[];
  comunications: ComunicationMessageRS[];

  constructor(private httpClient: HttpClient) {
    this.blockMotives = [];
    this.justifications = [];
    this.constants = [];
    this.provinces = [];
    this.comunications = [];
    this.billingTypes = [];
    this.profesionalTypes = [];
    this.establishmentTypes = [];
    this.productTypes = [];
    this.getParams();
  }

  getParams() {




    /*this.httpClient.post<Constant[]>('/rest/constante/adm/search', {}).subscribe(
      data => this.constants = data || []
    );*/
    this.constants = this.constantes;


    /*this.httpClient.post<Justification[]>('/rest/justificacion/adm/search', {}).subscribe(
      data => this.justifications = data || []
    );*/
    this.justifications = this.justificaciones;

    /*this.httpClient.post<Justification[]>('/rest/motivoBloqueo/adm/search', { state: true }).subscribe(
      data => this.blockMotives = data || []
    );*/
    this.blockMotives = this.motivoBloqueo;



    /*this.httpClient.post<Constant[]>('/api/rest/tipoFacturacion/search', {}).subscribe(
      data => this.billingTypes = data.map(c => <BillingType>{ code: c.code, description: c.description }) || []
    );*/
    this.billingTypes = this.tipoFacturacion;



    /*this.httpClient.post<Constant[]>('/api/rest/tipoProfesional/search', {}).subscribe(
      data => this.profesionalTypes = data || []
    );*/
    this.profesionalTypes = this.tipoProfesional;




    /*this.httpClient.post<Constant[]>('/api/rest/tipoEstablecimiento/search', {}).subscribe(
      data => this.establishmentTypes = data || []
    );*/

    this.establishmentTypes = this.tipoEstablecimiento;




    /*this.httpClient.post<Constant[]>('/api/rest/tipoProducto/search', {}).subscribe(
      data => this.productTypes = data || []
    );*/

    this.productTypes = this.tipoProducto;

    /*this.httpClient.post<Province[]>('/rest/province/search', {}).subscribe(
      data => this.provinces = data || []
    );*/
    this.provinces = this.provincias;



    /*this.httpClient.post<ComunicationMessageRS[]>('/rest/comunicacion/findComunicacion', {}).subscribe(data => this.comunications = data);*/
    this.comunications = [];



  }

  //mockData

  private tipoFacturacion: BillingType[] = [
    {
      "code": "facturacion001",
      "description": "Facturación001"
    },
    {
      "code": "facturacion002",
      "description": "Facturación002"
    },
    {
      "code": "facturacion003",
      "description": "Facturación003"
    },
  ];

  private tipoProducto: Constant[] = [
    {
      "code": "producto001",
      "description": "producto001",
      "value": "PRODUCT001"
    },
    {
      "code": "producto002",
      "description": "producto002",
      "value": "PRODUCT0002"
    },
    {
      "code": "producto003",
      "description": "producto003",
      "value": "PRODUCT0003"
    },
  ];

  private tipoProfesional: Constant[] = [
    {
      "code": "facturacion001",
      "description": "Facturación001",
      "value": "FACT001"
    },
    {
      "code": "facturacion002",
      "description": "Facturación002",
      "value": "FACT002"
    },
    {
      "code": "facturacion003",
      "description": "Facturación003",
      "value": "FACT003"
    },
  ];

  private tipoEstablecimiento: Constant[] = [
    {
      "code": "establecimiento001",
      "description": "establecimiento001",
      "value": "EST001"
    },
    {
      "code": "establecimiento002",
      "description": "establecimiento002",
      "value": "EST002"
    },
    {
      "code": "establecimiento003",
      "description": "establecimiento003",
      "value": "EST003"
    },
  ];

  private motivoBloqueo: Justification[] = [
    {
      "code": "111",
      "description": "111 no es",
      "remarks": "",
      "state": false
    },
    {
      "code": "TTT",
      "description": "TEST TEST 9",
      "remarks": "",
      "state": false
    },
    {
      "code": "12",
      "description": "test gema",
      "remarks": "",
      "state": true
    },
    {
      "code": "8",
      "description": "Description 3",
      "remarks": "",
      "state": false
    },
    {
      "code": "10",
      "description": "10 observaciones",
      "remarks": "",
      "state": true
    },
    {
      "code": "9",
      "description": "Observación obligatoria",
      "remarks": "10/05/2023",
      "state": false
    },
    {
      "code": "1",
      "description": "MOTIVO BLOQUEO 1",
      "remarks": "",
      "state": false
    },
    {
      "code": "2",
      "description": "MOTIVO BLOQUEO 2",
      "remarks": "",
      "state": false
    },
    {
      "code": "3",
      "description": "MOTIVO BLOQUEO 3",
      "remarks": "",
      "state": true
    },
    {
      "code": "4",
      "description": "MOTIVO BLOQUEO para MArc, de baja!",
      "remarks": "07/05/2023",
      "state": true
    },
    {
      "code": "5",
      "description": "MMotivo de baja incoherente",
      "remarks": "20/07/2023",
      "state": false
    },
    {
      "code": "6",
      "description": "Descripción",
      "remarks": "09/05/2023",
      "state": true
    },
    {
      "code": "7",
      "description": "Description 2",
      "remarks": "09/05/2023",
      "state": true
    },
    {
      "code": "B004",
      "description": "Otras",
      "remarks": "",
      "state": true
    },
    {
      "code": "B001",
      "description": "Lateralidad",
      "remarks": "",
      "state": false
    },
    {
      "code": "B002",
      "description": "Tipo de producto",
      "remarks": "",
      "state": true
    },
    {
      "code": "B003",
      "description": "Edad del paciente",
      "remarks": "",
      "state": true
    },
    {
      "code": "45",
      "description": "54654 hthf",
      "remarks": "",
      "state": true
    }
  ]

  private provincias: Province[] = [
        {
          "code": "01",
          "description": "Ávila"
        },
        {
          "code": "02",
          "description": "Burgos"
        },
        {
          "code": "03",
          "description": "León"
        },
        {
          "code": "04",
          "description": "Palencia"
        },
        {
          "code": "05",
          "description": "Salamanca"
        },
        {
          "code": "06",
          "description": "Segovia"
        },
        {
          "code": "07",
          "description": "Soria"
        },
        {
          "code": "08",
          "description": "Valladolid"
        },
        {
          "code": "09",
          "description": "Zamora"
        }
      ]

  private constantes: Constant[] = [
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
    "value": "S"
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

private justificaciones: Justification[] = [
  {
    "code": "C001",
    "description": "Justificación 1",
    "remarks": "",
    "state": true
  },
  {
    "code": "C002",
    "description": "Justificación 2",
    "remarks": "",
    "state": true
  },
  {
    "code": "C003",
    "description": "Justificación 3",
    "remarks": "09/05/2023",
    "state": false
  },
  {
    "code": "454",
    "description": "Justifica",
    "remarks": "",
    "state": false
  },
  {
    "code": "C005",
    "description": "Observación obligatoria",
    "remarks": "24/05/2023",
    "state": true
  },
  {
    "code": "C004",
    "description": "Justificación 4",
    "remarks": "",
    "state": true
  },
  {
    "code": "J001",
    "description": "Crecimiento",
    "remarks": "",
    "state": false
  },
  {
    "code": "J002",
    "description": "Desgaste no debido al mal uso",
    "remarks": "",
    "state": true
  },
  {
    "code": "J003",
    "description": "Sobrecarga del sobrepeso (Sillas de Ruedas)",
    "remarks": "",
    "state": true
  },
  {
    "code": "J004",
    "description": "Otras",
    "remarks": "",
    "state": true
  },
  {
    "code": "ytytr",
    "description": "tyttryrt htrhtr",
    "remarks": "",
    "state": true
  }
];

  getIva(disability: number, reducedTax: boolean) {
    if (disability > this.discapacityThreshold && reducedTax) {
      return 1.04;
    } else {
      return 1.1;
    }
  }

  getIvaPercentage(disability: number, reducedTax: boolean) {
    const value = (this.getIva(disability, reducedTax) * 100 - 100).toFixed(0);
    return `${value} %`;
  }

  getbyCode(code: string) {
    return this.constants.find(c => c.code === code);
  }

  get discapacityThreshold() {
    return Number(this.constants.find(c => c.code === ConstantKeys.PORC_DISCAPACIDAD)?.value || 33);
  }

  get historicThreshold() {
    return Number(this.constants.find(c => c.code === ConstantKeys.T_HISTORICAL)?.value || 2);
  }

  get historicMaxThreshold() {
    return Number(this.constants.find(c => c.code === ConstantKeys.T_MAX_HISTORICAL)?.value || 4);
  }

  get modificationDispendThreshold() {
    return Number(this.constants.find(c => c.code === ConstantKeys.MOD_DISPENSATION)?.value || 24);
  }

  get modificationReserveThreshold() {
    return Number(this.constants.find(c => c.code === ConstantKeys.MOD_RESERVE)?.value || 24);
  }

  get modificationBlockThreshold() {
    return Number(this.constants.find(c => c.code === ConstantKeys.MOD_PRECAUTIONARY_BLOCK)?.value || 24);
  }

  get selectCommercialBrand() {
    return this.constants.find(c => c.code === ConstantKeys.COMMERCIAL_BRAND)?.value === 'S' || false;
  }

  get daysOfMaxValidityDate() {
    return Number(this.constants.find(c => c.code === ConstantKeys.MAX_VALIDITY_DATE_SUP)?.value || 365);
  }
}
