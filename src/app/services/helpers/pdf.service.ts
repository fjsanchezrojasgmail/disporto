/* eslint-disable comma-dangle */
import { GeneralBilling, IndividualBilling, IndividualBillingItem, ProvincialBilling, ProvincialBillingItem, ProvincialBillingRegularizations } from './../../bean/models/pdf-model';
import { Injectable } from '@angular/core';
import { Prescription } from '../../bean/models/prescription';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { EstablishmentBillingTypes } from 'src/app/bean/constants';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  pdfBuilder: typeof pdfMake;
  subtotalGastoProvincial = 0;

  constructor() {
    this.pdfBuilder = pdfMake;
    this.pdfBuilder.vfs = pdfFonts.pdfMake.vfs;

  }

  createPdfFromDispensations(list: Prescription[]) {
    //TODO usar la funcion privada para generar la definicion
    const docDefinition: TDocumentDefinitions = this.pdfDispensationsDefiniton(list);
    //TODO se tiene que llegar a poder ejecutar esto
    this.pdfBuilder.createPdf(docDefinition).open();
  }

  createPdfIndividualBilling(billing: IndividualBilling, codeTipoFactura: string) {

    //TODO usar la funcion privada para generar la definicion
    const docDefinition: TDocumentDefinitions = this.pdfEstablishmentBillingDefiniton(billing, codeTipoFactura);
    //TODO se tiene que llegar a poder ejecutar esto
    this.pdfBuilder.createPdf(docDefinition).open();
  }

  createPdfProvincialBilling(billing: ProvincialBilling) {
    //TODO usar la funcion privada para generar la definicion
    const docDefinition: TDocumentDefinitions = this.pdfProvinceBillingDefinition(billing);
    //TODO se tiene que llegar a poder ejecutar esto
    this.pdfBuilder.createPdf(docDefinition).open();
  }

  createPdfGeneralBilling(billing: GeneralBilling) {
    //TODO usar la funcion privada para generar la definicion
    const docDefinition: TDocumentDefinitions = this.pdfGeneralBillingDefiniton(billing);
    //TODO se tiene que llegar a poder ejecutar esto
    this.pdfBuilder.createPdf(docDefinition).open();
  }


  private pdfDispensationsDefiniton(list: Prescription[]): TDocumentDefinitions {
    return <TDocumentDefinitions>{};
  }

  private pdfEstablishmentBillingDefiniton(billing: IndividualBilling, codeTipoFactura: string): TDocumentDefinitions {

    let esIndependiente = false;
    if (codeTipoFactura === EstablishmentBillingTypes.INDEPENDENT) esIndependiente = true;

    let docDefinition: TDocumentDefinitions = { content: [] };
    if (billing) {
      docDefinition = {
        content: [
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: 'MODELO FACTURA INDIVIDUAL ORTOPRÓTESIS (F.I.O)',
                    alignment: 'center',
                    bold: true,
                  },
                ],
              ],
            },
          },
          '\n',
          {
            table: {
              widths: ['auto'],
              body: [
                [
                  {
                    text: [
                      { text: 'Factura de: ', bold: true },
                      `${billing.idFactura} (${this.obtenerNombreMes(billing.mesFactura)}/${billing.añoFactura})`
                    ],
                    alignment: 'left',
                    fontSize: 12,
                    border: [false, false, false, false]
                  },
                ],
              ],
            },
          },
          '\n',
          {
            table: {
              widths: ['auto', '*', 'auto'],
              body: [
                [
                  {
                    text: [
                      { text: 'Identificador Establecimiento: ', bold: true },
                      `${billing.idEstablecimiento}`
                    ],
                    alignment: 'left',
                    border: [false, false, false, false]
                  },
                  { text: '', border: [false, false, false, false] },
                  {
                    text: [
                      { text: 'Titular: ', bold: true },
                      `${billing.titular}`
                    ],
                    alignment: 'left',
                    border: [false, false, false, false]
                  }
                ],
                [
                  {
                    text: [
                      { text: 'Fecha: ', bold: true },
                      `${billing.fechaCierre}`
                    ],
                    alignment: 'left',
                    border: [false, false, false, false]
                  },

                  { text: '', border: [false, false, false, false] },
                  {
                    text: [
                      { text: 'Provincia: ', bold: true },
                      billing.provincia
                    ],
                    alignment: 'left',
                    border: [false, false, false, false]
                  },

                ],
              ],
            },
          },
          '\n',
          this.pdfEstablishmentBillingTable(billing, billing.prescripcion, esIndependiente)
        ],
        styles: {
          tableHeader: {
            bold: true,
          },
        },
      };
    }

    return docDefinition;

  }

  private pdfEstablishmentBillingTable(billing: IndividualBilling, prescriptionItems: IndividualBillingItem[], esIndependiente: boolean) {

    const totalNumProductos = prescriptionItems.reduce((total, item) => total + (item.numProductos || 0), 0);
    const totalPrecioFacturacion = this.formatNumber(prescriptionItems.reduce((total, item) => total + (item.precioFacturacion || 0), 0));
    const totalAportacion = this.formatNumber(prescriptionItems.reduce((total, item) => total + (item.aportacion || 0), 0));
    const totalGastoFinal = this.formatNumber(prescriptionItems.reduce((total, item) => total + (item.gastoFinal || 0), 0));

    const tableProducts = {
      style: 'tableRows',
      alignment: 'center',
      widths: [85, 95, 60, 75, 70, 75],
      body: [
        [
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Id. Prescripción',
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Cód Tipo Producto',
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Nº Productos',
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Precio de Facturación',
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Aportación',
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Gasto Final',
          },
        ],
        ...prescriptionItems.map(item => [
          {
            border: [true, false, false, false],
            text: item.idPrescripcion.split('-')[1] || '' //Se quita la coletilla "Requestgroup"
          },
          {
            border: [false, false, false, false],
            text: item.codTipoProducto,
          },
          {
            border: [false, false, false, false],
            text: item.numProductos,
          },
          {
            border: [false, false, false, false],
            text: item.precioFacturacion.toFixed(2),
          },
          {
            border: [false, false, false, false],
            text: item.aportacion.toFixed(2),
          },
          {
            border: [false, false, true, false],
            text: item.gastoFinal.toFixed(2),
          },
        ]),
        [
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'TOTAL',
            colSpan: 2,
            alignment: 'right'
          },
          {},
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: billing.totalProductos !== totalNumProductos ? totalNumProductos : billing.totalProductos
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: billing.totalFacturacion.toString() !== totalPrecioFacturacion ? totalPrecioFacturacion : billing.totalFacturacion
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: billing.totalAportacion.toString() !== totalAportacion ? totalAportacion : billing.totalAportacion
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: billing.totalGasto.toString() !== totalGastoFinal ? totalGastoFinal : billing.totalGasto
          },
        ],
      ]
    };

    return {
      stack: [
        {
          style: 'tableRows',
          table: tableProducts
        },

        // El operador de propagación (...) se emplea para extender dinámicamente el array 'stack' del documento PDF.
        // Si 'esIndependiente' y 'billing.tablaRegularizacion' son verdaderos, se agrega una nueva entrada al array.
        // Se introduce un '1' al final para que después se identifique que viene de una factura Individual
        ...(esIndependiente && billing.tablaRegularizacion ? ['\n', this.pdfProvincialBillingTablePQ(
          billing.tablaRegularizacion, parseFloat(totalGastoFinal), '1')] : [])

      ]
    };
  }

  private pdfProvinceBillingDefinition(billing: ProvincialBilling): TDocumentDefinitions {
    let docDefinition: TDocumentDefinitions = { content: [] };

    if (billing) {
      docDefinition = {
        content: [
          {
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: 'MODELO FACTURA PROVINCIAL ORTOPRÓTESIS (F.P.O)',
                    alignment: 'center',
                    bold: true,
                  },
                ],
              ],
            },
          },
          '\n',
          {
            text: `Resumen de Facturación de: ${billing.idFactura} (${this.obtenerNombreMes(billing.mesFactura)}/${billing.añoFactura})`,
            alignment: 'center',
            fontSize: 12,
          },
          '\n',
          {
            text: billing.provincia,
            alignment: 'center',
            fontSize: 12,
          },
          '\n',
          this.pdfProvincialBillingTable(billing.prescripcionCentro),
          '\n',
          this.pdfProvincialBillingTablePQ(billing.regularizationTable),
          '\n',
          {
            text: `Por: ${billing.provincia}`,
            alignment: 'left',
            fontSize: 12,
          },
          {
            text: `CIF: ${billing.cif}`,
          },
          {
            text: `D: ${billing.usuario}`,
            alignment: 'left',
            fontSize: 12,
          },
          '\n',
          {
            text: 'Cargo (Representante Legal)',
          },
          '\n\n\n',
          {
            text: 'Sello, fecha y firma',
          },
          '\n\n\n\n\n',
          {
            text: '*P:. Prótesis, Ortesis y Ortoprótesis especiales\n' +
              '**Q: Vehículos para inválidos\n' +
              '*** El importe correspondiente a este apartado se introducirá con signo negativo'
          },


        ],
        styles: {
          tableHeader: {
            bold: true,
          },
        },
      };
    }

    return docDefinition;

  }

  private pdfProvincialBillingTable(prescriptionItems: ProvincialBillingItem[]) {
    const groupedItems: { [key: string]: ProvincialBillingItem } = {};

    prescriptionItems.forEach(item => {
      if (groupedItems[item.codEstablecimiento]) {
        groupedItems[item.codEstablecimiento].numProductos += item.numProductos || 0;
        groupedItems[item.codEstablecimiento].importeFacturacion += item.importeFacturacion || 0;
        groupedItems[item.codEstablecimiento].aportacion += item.aportacion || 0;
        groupedItems[item.codEstablecimiento].gastoFinal += item.gastoFinal || 0;
      } else {
        groupedItems[item.codEstablecimiento] = { ...item };
      }

    });

    const subtotalNumProductos = Object.values(groupedItems).reduce((total, item) => total + (item.numProductos || 0), 0);
    const subtotalImporte = this.formatNumber(Object.values(groupedItems).reduce((total, item) => total + (item.importeFacturacion || 0), 0));
    const subtotalAportacion = this.formatNumber(Object.values(groupedItems).reduce((total, item) => total + (item.aportacion || 0), 0));
    const subtotalGastoFinal = this.formatNumber(Object.values(groupedItems).reduce((total, item) => total + (item.gastoFinal || 0), 0));
    this.subtotalGastoProvincial = parseFloat(subtotalGastoFinal);
    const subtotalTableRows = Object.keys(groupedItems).map(key => [
      {
        border: [true, false, false, false],
        text: groupedItems[key].codEstablecimiento,
      },
      {
        border: [false, false, false, false],
        text: groupedItems[key].numProductos,
      },
      {
        border: [false, false, false, false],
        text: this.formatNumber(groupedItems[key].importeFacturacion),
      },
      {
        border: [false, false, false, false],
        text: this.formatNumber(groupedItems[key].aportacion),
      },
      {
        border: [false, false, true, false],
        text: this.formatNumber(groupedItems[key].gastoFinal),
      },
    ]);

    const provincialTable = {
      style: 'tableRows',
      widths: ['*', 75, '*', 75, 100],
      body: [
        [
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Cód Establecimiento',
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Nº Productos',
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Importe',
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Aportación',
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'Gasto Final',
          },
        ],
        ...subtotalTableRows,
        [
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: 'SUBTOTAL',
            alignment: 'right'
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: subtotalNumProductos
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: subtotalImporte
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: subtotalAportacion
          },
          {
            border: [true, true, true, true],
            style: ['tableHeader'],
            text: subtotalGastoFinal
          },
        ],
      ]
    };

    return {
      stack: [
        {
          style: 'tableRows',
          table: provincialTable
        },
      ]
    };
  }

  private pdfProvincialBillingTablePQ(r: ProvincialBillingRegularizations, gastoFinalIndividual?: number, tipoFacturacion?: string) {
    const incrementoP = this.formatNumber(r.incrementoP);
    const incrementoQ = this.formatNumber(r.incrementoQ);
    const totalIncremento = this.formatNumber(r.totalIncremento);
    const deduccionP = this.formatNumber(r.deduccionP);
    const deduccionQ = this.formatNumber(r.deduccionQ);
    const totalDeduccion = this.formatNumber(r.totalDeduccion);
    const totalP = this.formatNumber(r.totalP);
    const totalQ = this.formatNumber(r.totalQ);

    // Si es una factura individual ignoramos la variable global del cálculo del subtotalGastoProvincial para que no afecte
    if (tipoFacturacion === '1') {
      this.subtotalGastoProvincial = 0;
    }

    const subtotalGastoProvincial = this.formatNumber(this.subtotalGastoProvincial);

    let totalTotal = parseFloat(subtotalGastoProvincial) + (parseFloat(totalIncremento) - parseFloat(totalDeduccion));

    if (gastoFinalIndividual !== undefined) {
      totalTotal += gastoFinalIndividual;
    }

    const provincialTablePQ = {
      style: 'tableRows',
      widths: ['*', '*', '*', '*'],
      body: [
        [
          { text: '', style: 'tableHeader' },
          { text: 'P*', style: 'tableHeader' },
          { text: 'Q**', style: 'tableHeader' },
          { text: 'TOTAL', style: 'tableHeader' }
        ],
        ['Incrementos', incrementoP, incrementoQ, totalIncremento],
        ['Deducciones', deduccionP, deduccionQ, totalDeduccion],
        ['Total', totalP, totalQ, this.formatNumber(totalTotal)]
      ]
    };

    return {
      table: provincialTablePQ
    };
  }




  private pdfGeneralBillingDefiniton(generalBilling: GeneralBilling): TDocumentDefinitions {
    let docDefinition: TDocumentDefinitions = { content: [] };

    docDefinition = {
      header: {
        text: 'MODELO DE FACTURA GENERAL ORTOPRÓTESIS (FGO)',
        alignment: 'center',
        bold: true,
        margin: [0, 10, 0, 0]
      },
      content: [
        {
          columns: [
            {
              table: {
                widths: [125, 100, '*', '*', '*', '*', '*', '*'],
                body: [
                  // Fila 1
                  [
                    {
                      text: [
                        { text: '', bold: true },
                        ` ${generalBilling.origen}`
                      ],
                      colSpan: 4,
                      border: [true, true, false, true],
                    },
                    {},
                    {},
                    {},
                    {
                      text: [
                        { text: '', bold: true },
                        ` ${generalBilling.provincia}`
                      ],
                      colSpan: 4,
                      border: [true, true, true, false],
                    },
                    {},
                    {},
                    {},
                  ],
                  // Fila 2
                  [
                    {
                      text: [
                        { text: 'CIF:', bold: true },
                        ` ${generalBilling.cifOrigen}`
                      ],
                      colSpan: 4,
                      border: [true, false, false, false],
                    },
                    {},
                    {},
                    {},
                    { text: '', colSpan: 4, border: [true, false, true, false] },
                    {},
                    {},
                    {},
                  ],
                  // Fila 3
                  [
                    {
                      text: [
                        { text: 'Dirección:', bold: true },
                        ` ${generalBilling.direccionOrigen}`
                      ],
                      colSpan: 4,
                      border: [true, false, false, false],
                    },
                    {},
                    {},
                    {},
                    {
                      text: [
                        { text: 'CIF:', bold: true },
                        ` ${generalBilling.cifProvincia}`
                      ],
                      colSpan: 4,
                      border: [true, false, true, false],
                    },
                    {},
                    {},
                    {},
                  ],
                  // Fila 4
                  [
                    {
                      text: [
                        { text: 'Nº Factura:', bold: true },
                        // eslint-disable-next-line
                        ` ${generalBilling.idFactura} (${this.extraerMesYAnoDesdeFactura(generalBilling.idFactura)?.mes}/${this.extraerMesYAnoDesdeFactura(generalBilling.idFactura)?.ano})`
                      ],
                      colSpan: 3,
                      border: [true, true, false, false]
                    },
                    {},
                    {},
                    { text: '', border: [false, true, false, false] },
                    { text: '', colSpan: 4, border: [true, false, true, false] },
                    {},
                    {},
                    {},
                  ],
                  // Fila 5
                  [
                    { text: '', colSpan: 4, border: [true, false, true, false] },
                    {},
                    {},
                    {},
                    {
                      text: [
                        { text: 'Dirección:', bold: true },
                        ` ${generalBilling.direccionProvincia}`
                      ],
                      colSpan: 4,
                      border: [true, false, true, false],
                    },
                    {},
                    {},
                    {},
                  ],
                  // Fila 6
                  [
                    {
                      text: [
                        { text: 'Fecha de cierre:', bold: true },
                        ` ${generalBilling.fechaCierre}`
                      ],
                      colSpan: 2,
                      border: [true, false, false, false],
                    },
                    {},
                    {
                      text: [
                        { text: 'Fecha:', bold: true },
                        ` ${generalBilling.fecha}`
                      ],
                      colSpan: 2,
                      border: [false, false, false, false],
                    },
                    {},
                    { text: '', colSpan: 4, border: [true, false, true, false] },
                    {},
                    {},
                    {},
                  ],
                ]
              },
            },
          ]
        },
        {
          columns: [
            {
              table: {
                widths: [195, 140, '*', '*', '*', '*'],
                body: [
                  // Fila 1
                  [
                    { text: 'DISPENSACIÓN Y GRUPOS', bold: true, alignment: 'center' },
                    { text: 'Nº PRESCRIPCIONES', bold: true, alignment: 'center' },
                    { text: 'Nº PRODUCTOS', bold: true, alignment: 'center' },
                    { text: 'IMPORTE FACT.', bold: true, alignment: 'center' },
                    { text: 'APORT. GRAL.', bold: true, alignment: 'center' },
                    { text: 'GASTO FINAL', bold: true, alignment: 'center' }
                  ],
                  // Fila 2
                  [
                    { text: 'PRÓTESIS (P)' },
                    { text: generalBilling.tablaGasto.numPresP },
                    { text: generalBilling.tablaGasto.numProdP },
                    { text: generalBilling.tablaGasto.importeFacturaP },
                    { text: generalBilling.tablaGasto.aporteP },
                    { text: generalBilling.tablaGasto.gastoFinalP }
                  ],
                  // Fila 3
                  [
                    { text: 'VEHÍCULOS PARA INVÁLIDOS (Q)' },
                    { text: generalBilling.tablaGasto.numPresQ },
                    { text: generalBilling.tablaGasto.numProdQ },
                    { text: generalBilling.tablaGasto.importeFacturaQ },
                    { text: generalBilling.tablaGasto.aporteQ },
                    { text: generalBilling.tablaGasto.gastoFinalQ }
                  ],
                  // Fila 4
                  [
                    { text: 'TOTAL GENERAL FINAL', bold: true, alignment: 'right' },
                    { text: generalBilling.tablaGasto.totalNumPres },
                    { text: generalBilling.tablaGasto.totalNumProd },
                    { text: generalBilling.tablaGasto.totalImporteFactura },
                    { text: generalBilling.tablaGasto.totalAporte },
                    { text: generalBilling.tablaGasto.totalGastoFinal }
                  ]
                ],
              },
            },
          ],
        },
      ],
      pageOrientation: 'landscape',
      pageSize: 'A4',
    };

    return docDefinition;
  }

  obtenerNombreMes(numeroMes: string): string {
    const mesComoNumero = parseInt(numeroMes, 10);
    const nombresMeses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    if (!isNaN(mesComoNumero) && mesComoNumero >= 1 && mesComoNumero <= 12) {
      return nombresMeses[mesComoNumero];
    } else {
      return 'Mes no válido';
    }
  }

  extraerMesYAnoDesdeFactura(numeroFactura: string): { mes: string, ano: number } | null {
    const partes = numeroFactura.split('-');
    if (partes.length === 4) {
      const numeroMes = partes[2];
      const ano = parseInt(partes[3], 10);

      return { mes: this.obtenerNombreMes(numeroMes), ano };
    }

    return null;
  }


  private formatNumber(value: number) {
    return value === 0 ? '0' : value.toFixed(2);
  }

}
