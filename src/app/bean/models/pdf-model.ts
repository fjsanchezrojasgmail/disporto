export interface IndividualBilling {
    idFactura: string;
    mesFactura: string;
    añoFactura: string
    idEstablecimiento: string;
    titular: string;
    fechaCierre: string;
    provincia: string;
    prescripcion: IndividualBillingItem[];
    tablaRegularizacion?: ProvincialBillingRegularizations;
    totalProductos: number;
    totalFacturacion: number;
    totalAportacion: number;
    totalGasto: number;
}

export type IndividualBillingItem = {
    idPrescripcion: string;
    codTipoProducto: string;
    numProductos: number;
    precioFacturacion: number;
    aportacion: number;
    gastoFinal: number;
}

export type ProvincialBilling = {
    idFactura: string;
    mesFactura: string;
    añoFactura: string;
    tipoFacturacion: string;
    provincia: string;
    prescripcionCentro: ProvincialBillingItem[];
    regularizationTable: ProvincialBillingRegularizations;
    cif?: string;
    usuario?: string;
    subtotalProductos?: number;
    subtotalImporte?: number;
    subtotalAportacion?: number;
    subtotalGasto?: number;

}

export type ProvincialBillingItem = {
    codEstablecimiento: string;
    numProductos: number;
    importeFacturacion: number;
    aportacion: number;
    gastoFinal: number;
}

export type ProvincialBillingRegularizations = {
    incrementoP: number;
    incrementoQ: number;
    deduccionP: number;
    deduccionQ: number;
    totalP: number;
    totalQ: number;
    totalIncremento: number;
    totalDeduccion: number;
    total: number;
}

export type GeneralBilling = {
    origen: string,
    cifOrigen: string,
    direccionOrigen: string,
    idFactura: string,
    fecha: string,
    fechaCierre: string,
    provincia: string,
    cifProvincia: string,
    direccionProvincia: string,
    tablaGasto: GeneralBillingTable,
    regularisationTable: ProvincialBillingRegularizations

}

export type GeneralBillingTable = {
    numPresP: number,
    numPresQ: number,
    numProdP: number,
    numProdQ: number,
    importeFacturaP: number,
    importeFacturaQ: number,
    aporteP: number,
    aporteQ: number,
    gastoFinalP: number,
    gastoFinalQ: number,
    totalNumPres: number,
    totalNumProd: number,
    totalImporteFactura: number,
    totalAporte: number,
    totalGastoFinal: number,
}



