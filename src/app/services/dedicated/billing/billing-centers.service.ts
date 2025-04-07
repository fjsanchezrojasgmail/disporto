import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { BillingActions, BillingStates, EstablishmentBillingTypes, ProfesionalTypes } from '../../../bean/constants';
import { Establishment } from '../../../bean/models/administration';
import { EstablishmentBillingRow, BillingGeneralFilter, EstablishmentBilling } from '../../../bean/models/billing';
import { BillingDispensation } from '../../../bean/models/prescription';
import { EstablishmentBillingDaoService } from '../../dao/establishment-billing-dao.service';
import { RegularisationDaoService } from '../../dao/regularisation-dao.service';
import { GlobalFeedbackService } from '../../global-feedback.service';
import { ProfesionalService } from '../../helpers/profesional/profesional.service';

@Injectable({
  providedIn: 'any'
})
export class BillingCentersService {

  private billingCenters: BehaviorSubject<EstablishmentBillingRow[]> = new BehaviorSubject<EstablishmentBillingRow[]>([]);
  billingCenters$ = this.billingCenters.asObservable();

  private pendingEstablishments: BehaviorSubject<Partial<Establishment>[]> = new BehaviorSubject<Partial<Establishment>[]>([]);
  pendingEstablishments$ = this.pendingEstablishments.asObservable();

  private loadingFetch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingFetch$ = this.loadingFetch.asObservable();

  constructor(
    private establishmentBillingService: EstablishmentBillingDaoService,
    private profesionalService: ProfesionalService,
    private feedback: GlobalFeedbackService,
    private regularisationDao: RegularisationDaoService,
    private translate: TranslateService) { }

  fetchBillingCenters(generalFilter: BillingGeneralFilter) {
    this.loadingFetch.next(true);
    this.pendingEstablishments.next([]);
    this.profesionalService.resetBillingActions();
    switch (this.profesionalService.profesional.typeProfesional) {
      case ProfesionalTypes.DISPENSER_ESTABLISHMENT:
        this.fetchByEstablishmentDispenser(generalFilter);
        break;
      case ProfesionalTypes.ASSOCIATION:
      case ProfesionalTypes.PROVINCIAL_COLLEGE:
      case ProfesionalTypes.CONCYL:
        this.fetchByAsociationColege(generalFilter);
        break;
      case ProfesionalTypes.SSCC_MANAGEMENT:
      case ProfesionalTypes.AREA_MANAGEMENT:
        this.fetchByManagement(generalFilter);
        break;
      default:
        this.translate.get('billing.warning.undefined_role').subscribe(text => {
          this.feedback.showWarningMessage(text);
        });
        this.loadingFetch.next(false);
        break;
    }
  }

  private fetchByEstablishmentDispenser(generalFilter: BillingGeneralFilter) {
    if (generalFilter.code) {
      this.establishmentBillingService.search(generalFilter).subscribe(data => {
        if (data.length > 0) {
          const rows = data.map((bill, index) => <EstablishmentBillingRow>{
            id: bill.code || index.toString(),
            check: false,
            expanded: false,
            selectable: false,
            selectableDispensation: false,
            billing: bill
          });
          this.billingCenters.next(rows);
          if (rows.some(r => r.billing.estadoFacturacion === BillingStates.CLOSED)) {
            this.profesionalService.addBillingActions(BillingActions.PRINT_INDIVIDUAL_BILLING);
            if (generalFilter.billingType?.code === EstablishmentBillingTypes.INDEPENDENT) {
              this.profesionalService.addBillingActions(BillingActions.PRINT_GENERAL_BILLING);
            }
          }
          if (rows.some(r => r.billing.estadoFacturacion === BillingStates.CONFIRMED &&
            r.billing.codeTipoFactura === EstablishmentBillingTypes.INDEPENDENT)) {
            this.profesionalService.addBillingActions(BillingActions.BILLING_CLOSING_ESTABLISHMENT);
          }
          if (rows.length === 1 && rows.some(r =>
            r.billing.estadoFacturacion !== BillingStates.PENDING_ACCEPTANCE &&
            r.billing.codeTipoFactura === EstablishmentBillingTypes.INDEPENDENT)) {
            this.canConsultRegularisations(rows, generalFilter);
          }
        }
        else if (data.length === 0 && this.profesionalService.establishment) { //PENDIENTE DE GENERAR EL CIERRE
          this.profesionalService.addBillingActions(BillingActions.GENERATE_CLOSING);
          this.billingCenters.next(
            this.createEstablishmentBilling(this.profesionalService.establishment)
          );
        }
        this.loadingFetch.next(false);
      });
    } else {
      this.translate.get('billing.error.no_code').subscribe(text => {
        this.feedback.showWarningMessage(text);
      });
      this.loadingFetch.next(false);
    }
  }

  private fetchByAsociationColege(generalFilter: BillingGeneralFilter) {
    this.establishmentBillingService.deepSearch({ ...generalFilter, flag: true }).subscribe(data => {
      const rows = data.map((bill, index) => <EstablishmentBillingRow>{
        id: bill.code || index.toString(),
        check: false,
        expanded: false,
        selectable: bill.estadoFacturacion === BillingStates.PENDING_ACCEPTANCE,
        selectableDispensation: false,
        billing: bill
      });
      this.billingCenters.next(rows);
      if (rows.length > 0 && rows.every(e => e.billing.codeFacturacionProvincial === undefined)) {
        // No existe facturacion provincial
        if (rows.some(r => r.billing.estadoFacturacion === BillingStates.PENDING_ACCEPTANCE)) {
          this.profesionalService.addBillingActions(BillingActions.ACCEPT_ESTABLISHMENT_BILLING);
        }
        if (rows.every(r => r.billing.estadoFacturacion === BillingStates.ACCEPTED)) {
          // Comprobar que todos los centros tienen factura (campanita)
          this.establishmentBillingService.checkPendings(generalFilter).subscribe(data => this.pendingEstablishments.next(data));
          this.profesionalService.addBillingActions(BillingActions.ACCEPT_PROVINCIAL_BILLING);
        }
      } else if (rows.length > 0 && rows.every(e => e.billing.codeFacturacionProvincial !== undefined)) {
        // Todas tienen factura provincial
        if (rows.some(r => r.billing.estadoFacturacion === BillingStates.CONFIRMED)) {
          this.profesionalService.addBillingActions(BillingActions.BILLING_CLOSING_ASSOCIATION);
        }
        if (rows.some(r => r.billing.estadoFacturacion === BillingStates.CLOSED)) {
          this.profesionalService.addBillingActions(BillingActions.PRINT_PROVINCIAL_BILLING);
          this.profesionalService.addBillingActions(BillingActions.PRINT_GENERAL_BILLING);
        }
        if (rows.some(r => r.billing.estadoFacturacion !== BillingStates.PENDING_ACCEPTANCE)) {
          this.canConsultRegularisations(rows, generalFilter);
        }
      }
      this.loadingFetch.next(false);
    });
  }

  private fetchByManagement(generalFilter: BillingGeneralFilter) {
    if (generalFilter.billingType?.code === EstablishmentBillingTypes.INDEPENDENT) {
      this.establishmentBillingService.search(generalFilter).subscribe(data => {
        const rows = data.map((bill, index) => <EstablishmentBillingRow>{
          id: bill.code || index.toString(),
          check: false,
          expanded: false,
          selectable: false,
          selectableDispensation: false,
          billing: bill
        });
        this.billingCenters.next(rows);
        if (rows.length === 1 && rows.some(r => r.billing.estadoFacturacion === BillingStates.ACCEPTED)) {
          this.profesionalService.addBillingActions(BillingActions.CONFIRM_BILLING);
          this.regularisationDao.searchPending({
            codeProvincia: generalFilter.province?.code,
            tipoFacturacionCode: generalFilter.billingType?.code,
            codeCentro: generalFilter.code
          }).subscribe(data => {
            if (data) this.profesionalService.addBillingActions(BillingActions.ASSOCIATE_REGULARIZATIONS);
          });
        }
        if (rows.length === 1 && rows.some(r => r.billing.estadoFacturacion !== BillingStates.PENDING_ACCEPTANCE)) {
          this.canConsultRegularisations(rows, generalFilter);
        }
        if (rows.length === 1 && rows.some(r => r.billing.estadoFacturacion === BillingStates.CLOSED)) {
          this.profesionalService.addBillingActions(BillingActions.PRINT_INDIVIDUAL_BILLING);
          this.profesionalService.addBillingActions(BillingActions.PRINT_GENERAL_BILLING);
        }
      });
      this.loadingFetch.next(false);
    } else {
      this.establishmentBillingService.deepSearch({ ...generalFilter, flag: false }).subscribe(data => {
        const rows = data.map((bill, index) => <EstablishmentBillingRow>{
          id: bill.code || index.toString(),
          check: false,
          expanded: false,
          selectable: false,
          selectableDispensation: false,
          billing: bill
        });
        this.billingCenters.next(rows);
        if (rows.length > 0 && rows.some(r => r.billing.estadoFacturacion === BillingStates.ACCEPTED)) {
          this.profesionalService.addBillingActions(BillingActions.CONFIRM_BILLING);
        }
        if (rows.length > 0 && rows.some(r => r.billing.estadoFacturacion === BillingStates.ACCEPTED)) {
          this.regularisationDao.searchPending({
            codeProvincia: generalFilter.province?.code,
            tipoFacturacionCode: generalFilter.billingType?.code,
            codeCentro: generalFilter.code
          }).subscribe(data => {
            if (data) this.profesionalService.addBillingActions(BillingActions.ASSOCIATE_REGULARIZATIONS);
          });
        }
        if (rows.length > 0 && rows.some(r => r.billing.estadoFacturacion !== BillingStates.PENDING_ACCEPTANCE)) {
          this.canConsultRegularisations(rows, generalFilter);
        }
        if (rows.length > 0 && rows.some(r => r.billing.estadoFacturacion === BillingStates.CLOSED)) {
          this.profesionalService.addBillingActions(BillingActions.PRINT_PROVINCIAL_BILLING);
          this.profesionalService.addBillingActions(BillingActions.PRINT_GENERAL_BILLING);
        }
      });

      this.loadingFetch.next(false);
    }
  }

  setCenter(center: EstablishmentBillingRow) {
    this.billingCenters.next([center]);
  }

  applyCheckBox(value: boolean) {
    const result = this.billingCenters.value.map(c => <EstablishmentBillingRow>{ ...c, check: value });
    this.billingCenters.next(result);
  }

  showDispensations(code: string) {
    this.billingCenters.next(this.billingCenters.value.map(b => {
      if (b.id === code && !b.expanded) b.expanded = true;
      else b.expanded = false;
      return b;
    }));
  }

  updateTotals(bill: EstablishmentBillingRow, dispensations: BillingDispensation[]) {
    bill.billing.totalAportacion = 0;
    bill.billing.totalFacturar = 0;
    bill.billing.totalGasto = 0;
    bill.billing.totalPrescripciones = dispensations.length;
    bill.billing.totalProductos = 0;
    bill.billing.totalAportacionQ = 0;
    bill.billing.totalFacturarQ = 0;
    bill.billing.totalGastoQ = 0;
    bill.billing.totalPrescripcionesQ = 0;
    bill.billing.totalProductosQ = 0;
    bill.billing.totalAportacionP = 0;
    bill.billing.totalFacturarP = 0;
    bill.billing.totalGastoP = 0;
    bill.billing.totalPrescripcionesP = 0;
    bill.billing.totalProductosP = 0;
    dispensations.forEach((disp) => {
      if (disp.check) {
        bill.billing.totalFacturar += disp.totalPvpTax || 0;
        bill.billing.totalAportacion += disp.totalAportation || 0;
        bill.billing.totalGasto += disp.totalDiff || 0;
        if (disp.products.some(p => p.pulledApart.code === 'S')) bill.billing.totalPrescripcionesQ += 1;
        if (disp.products.some(p => p.pulledApart.code !== 'S')) bill.billing.totalPrescripcionesP += 1;
        disp.products.forEach(prod => {
          if (prod.pulledApart.code === 'S') {
            bill.billing.totalFacturarQ += prod.pvp.total || 0;
            bill.billing.totalAportacionQ += prod.userConsideration.realAportation || 0;
            bill.billing.totalGastoQ += (prod.pvp.total || 0) - (prod.userConsideration.realAportation || 0);
            bill.billing.totalProductosQ += prod.units.value;
            bill.billing.totalProductos += prod.units.value;
          } else {
            bill.billing.totalFacturarP += prod.pvp.total || 0;
            bill.billing.totalAportacionP += prod.userConsideration.realAportation || 0;
            bill.billing.totalGastoP += (prod.pvp.total || 0) - (prod.userConsideration.realAportation || 0);
            bill.billing.totalProductosP += prod.units.value;
            bill.billing.totalProductos += prod.units.value;
          }
        });
      }
    });
  }

  get CenterTotalRecords() {
    return this.billingCenters.value.length;
  }

  private createEstablishmentBilling(est: Establishment): EstablishmentBillingRow[] {
    return [<EstablishmentBillingRow>{
      id: est.code,
      check: false,
      selectable: true,
      selectableDispensation: true,
      expanded: false,
      billing: <EstablishmentBilling>{
        codeCenter: est.code,
        descriptionCenter: est.centerName,
        codeRegion: est.codeRegion,
        descriptionRegion: est.descriptionRegion,
        dni: this.profesionalService.profesional.dni,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        codeTipoFactura: est.codeFact,
        estadoFacturacion: BillingStates.PENDING_GENERATE,
        totalAportacion: 0, // sumatorio aportacion real
        totalFacturar: 0, // costo real unidades pvp iva
        totalGasto: 0, // diferencia facturar - aportacion
        totalPrescripciones: 0, // numero prescripciones dispensadas
        totalProductos: 0, // total productos dispensados
        totalAportacionQ: 0,
        totalFacturarQ: 0,
        totalGastoQ: 0,
        totalPrescripcionesQ: 0,
        totalProductosQ: 0,
        totalAportacionP: 0,
        totalFacturarP: 0,
        totalGastoP: 0,
        totalPrescripcionesP: 0,
        totalProductosP: 0
      }
    }];
  }

  private canConsultRegularisations(rows: EstablishmentBillingRow[], generalFilter: BillingGeneralFilter) {
    if (generalFilter.billingType?.code === EstablishmentBillingTypes.INDEPENDENT) {
      const code = rows.at(0)?.billing.codeFactura;
      if (code) {
        this.regularisationDao.searchAssociated({
          facturacionEstablecimientoCode: code
        }).subscribe(data => {
          if (data) this.profesionalService.addBillingActions(BillingActions.CONSULT_REGULARIZATIONS);
        });
      }
    } else {
      const code = rows.at(0)?.billing.codeFacturacionProvincial;
      if (code) {
        this.regularisationDao.searchAssociated({
          facturacionProvincialCode: code
        }).subscribe(data => {
          if (data) this.profesionalService.addBillingActions(BillingActions.CONSULT_REGULARIZATIONS);
        });
      }
    }
  }
}
