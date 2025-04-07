import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BillingActions, BillingStates, EstablishmentBillingTypes, ProfesionalTypes } from '../../bean/constants';
import { Establishment } from '../../bean/models/administration';
import { BillingGeneralFilter } from '../../bean/models/billing';
import { Month } from '../../bean/simple.types';
import { ConstantsService } from '../../services/constants.service';
import { BillingService } from '../../services/dedicated/billing/billing.service';
import { GlobalFeedbackService } from '../../services/global-feedback.service';
import { ProfesionalService } from '../../services/helpers/profesional/profesional.service';
import { getMonths } from '../../utils/utils';
import { BillingListComponent } from './billing-list/billing-list.component';
import { BillingRegularisationsComponent } from './billing-regularisations/billing-regularisations.component';
import { ConfirmDniModalComponent } from './confirm-dni-modal/confirm-dni-modal.component';
import { NotificationsDialogComponent } from './notifications-dialog/notifications-dialog.component';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { Tooltip } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BillingActionsComponent } from './billing-actions/billing-actions.component';

@Component({
  selector: 'sacyl-billing',
  standalone: true,
  imports: [
    CommonModule,
    CalendarModule,
    DropdownModule,
    Tooltip,
    BillingListComponent,
    ConfirmDniModalComponent,
    NotificationsDialogComponent,
    BillingRegularisationsComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    BillingActionsComponent,

  ],
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
  providers: [BillingService]
})
export class BillingComponent implements OnInit {
  @ViewChild(BillingListComponent) billingList!: BillingListComponent;
  @ViewChild(ConfirmDniModalComponent) confirmModal!: ConfirmDniModalComponent;
  @ViewChild(NotificationsDialogComponent) notificationsDialog!: NotificationsDialogComponent;
  @ViewChild(BillingRegularisationsComponent) billingRegularisation!: BillingRegularisationsComponent;
  loading = false;

  generalFilter?: BillingGeneralFilter;
  independent = EstablishmentBillingTypes.INDEPENDENT;
  pendingEstablishments: Partial<Establishment>[] = [];
  months: Month[];

  constructor(
    private constantsService: ConstantsService,
    private profesionalService: ProfesionalService,
    private billingService: BillingService,
    private globalFeedback: GlobalFeedbackService
  ) {
    this.billingService.loadingAction$.subscribe((value) => {
      if (this.loading && !value) {
        this.applyFilter();
      }
      this.loading = value;
    });

    this.months = getMonths();
  }

  ngOnInit() {
    this.recursiveInitFilter();
  }

  //if billingTypes are not loaded
  recursiveInitFilter() {
    if (this.billingTypes.length === 0 || this.provinces.length === 0) {
      setTimeout(() => this.recursiveInitFilter(), 100);
    } else {
      this.initFilter();
    }
  }

  applyFilter() {
    if (this.generalFilter) this.billingList.applyGeneralFilter(this.generalFilter);
  }

  menuAction(action: BillingActions) {
    switch (action) {
      case BillingActions.GENERATE_CLOSING:
        this.generateClosure();
        break;
      case BillingActions.ACCEPT_ESTABLISHMENT_BILLING:
        this.acceptEstablishmentBilling();
        break;
      case BillingActions.ACCEPT_PROVINCIAL_BILLING:
        this.acceptProvincialBilling();
        break;
      case BillingActions.ASSOCIATE_REGULARIZATIONS:
        this.consultRegularisation(BillingActions.ASSOCIATE_REGULARIZATIONS);
        break;
      case BillingActions.CONSULT_REGULARIZATIONS:
        this.consultRegularisation(BillingActions.CONSULT_REGULARIZATIONS);
        break;
      case BillingActions.CONFIRM_BILLING:
        this.consultRegularisation(BillingActions.CONFIRM_BILLING);
        break;
      case BillingActions.BILLING_CLOSING_ASSOCIATION:
        this.billingClosingAssociation();
        break;
      case BillingActions.BILLING_CLOSING_ESTABLISHMENT:
        this.billingClosingEstablishment();
        break;
      case BillingActions.PRINT_INDIVIDUAL_BILLING:
        this.printIndividualBilling();
        break;
      case BillingActions.PRINT_PROVINCIAL_BILLING:
        this.printProvincialBilling();
        break;
      case BillingActions.PRINT_GENERAL_BILLING:
        this.printGeneralBilling();
        break;
      default:
        break;
    }
  }

  initFilter() {
    this.generalFilter = this.billingService.initFilterByProfesional();
  }

  generate() {
    this.billingService.generateClosure(
      this.billingList.billingEstablishments?.find(c => c.check || c.expanded),
      this.billingList.currentDispensations.filter(d => d.check),
      this.billingList.currentBundles,
      this.generalFilter);
  }

  showNotifications() {
    this.notificationsDialog.show();
  }

  updateNotifications(list: Partial<Establishment>[]) {
    this.pendingEstablishments = list;
  }

  get provinces() {
    let prov = this.profesionalService.profesional.provinces;
    const est = this.profesionalService.establishment;
    if (prov.length === 0 && est) {
      prov = [{ code: est.codeRegion, description: est.descriptionRegion }];
    }
    return prov;
  }

  get billingTypes() {
    return this.constantsService.billingTypes;
  }

  get disableProvinces() {
    switch (this.profesionalService.profesional?.typeProfesional) {
      case ProfesionalTypes.DISPENSER_ESTABLISHMENT:
      case ProfesionalTypes.PROVINCIAL_COLLEGE:
      case ProfesionalTypes.AREA_MANAGEMENT:
        return true;
      case ProfesionalTypes.CONCYL:
      case ProfesionalTypes.ASSOCIATION:
      case ProfesionalTypes.SSCC_MANAGEMENT:
        return false;
      default:
        return false;
    }
  }

  get disableBillingType() {
    switch (this.profesionalService.profesional?.typeProfesional) {
      case ProfesionalTypes.DISPENSER_ESTABLISHMENT:
      case ProfesionalTypes.ASSOCIATION:
      case ProfesionalTypes.PROVINCIAL_COLLEGE:
      case ProfesionalTypes.CONCYL:
        return true;
      case ProfesionalTypes.AREA_MANAGEMENT:
      case ProfesionalTypes.SSCC_MANAGEMENT:
        return false;
      default:
        return false;
    }
  }

  private generateClosure() {
    const bill = this.billingList.billingEstablishments?.find(c => c.check || c.expanded)?.billing;
    const dispensations = this.billingList.currentDispensations.filter(d => d.check);
    const bundles = this.billingList.currentBundles;

    if (!bill) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.no_expanded');
    } else if (dispensations.length <= 0) {
      this.globalFeedback.showTranslatedWarningMessage('billing.warning.dispensation');
    } else if (!bundles || bundles.length <= 0) {
      this.globalFeedback.showTranslatedWarningMessage('billing.warning.bundle');
    } else if (bill?.estadoFacturacion !== BillingStates.PENDING_GENERATE) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.not_acceptable');
    } else {
      this.confirmModal.show();
    }

  }

  private consultRegularisation(action: BillingActions) {
    let billCode: string | undefined = undefined;
    if (this.generalFilter?.billingType?.code === EstablishmentBillingTypes.INDEPENDENT) {
      billCode = this.billingList.billingEstablishments?.at(0)?.billing.codeFactura;
      if (billCode) {
        if (action === BillingActions.ASSOCIATE_REGULARIZATIONS) {
          this.billingRegularisation.show(action, { facturacionEstablecimientoCode: billCode });
        } else {
          this.billingService.checkExistAssociated({ facturacionEstablecimientoCode: billCode }).subscribe(data => {
            if (data) this.billingRegularisation.show(action, { facturacionEstablecimientoCode: billCode });
            else {
              if (action === BillingActions.CONFIRM_BILLING) this.confirmBilling();
            }
          });
        }
      }
      else {
        this.globalFeedback.showTranslatedWarningMessage('billing.error.code_factura');
      }
      //}
    } else {
      billCode = this.billingList.billingEstablishments?.at(0)?.billing.codeFacturacionProvincial;
      if (billCode) {
        if (action === BillingActions.ASSOCIATE_REGULARIZATIONS) {
          this.billingRegularisation.show(action, { facturacionProvincialCode: billCode });
        } else {
          this.billingService.checkExistAssociated({ facturacionProvincialCode: billCode }).subscribe(data => {
            if (data) this.billingRegularisation.show(action, { facturacionProvincialCode: billCode });
            else {
              if (action === BillingActions.CONFIRM_BILLING) this.confirmBilling();
            }
          });
        }
      }
      else {
        this.globalFeedback.showTranslatedWarningMessage('billing.error.code_factura');
      }
    }
  }

  private acceptEstablishmentBilling() {
    const list = this.billingList.billingEstablishments?.filter(c => c.check).map(e => e.billing);
    if (list.length === 0) {
      this.globalFeedback.showTranslatedWarningMessage('billing.warning.need_selecction');
    } else {
      const pendings = list.filter(l => l.estadoFacturacion === BillingStates.PENDING_ACCEPTANCE);
      if (pendings.length === 0) {
        this.globalFeedback.showTranslatedWarningMessage('billing.warning.not_acceptable');
      } else {
        this.billingService.acceptEstablishmentBilling(pendings);
      }
    }
  }

  private acceptProvincialBilling() {
    const list = this.billingList.billingEstablishments.map(e => e.billing);
    if (list.length === 0) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.no_expanded');
    } else if (list.some(e => e.estadoFacturacion !== BillingStates.ACCEPTED)) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.not_acceptable');
    } else if (!this.generalFilter) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.not_acceptable');
    } else {
      this.billingService.acceptProvincialBilling(list, this.generalFilter);
    }
  }

  confirmBilling() {
    const list = this.billingList.billingEstablishments?.map(e => e.billing);
    if (list.length === 0) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.no_expanded');
    } else if (list.some(e => e.estadoFacturacion !== BillingStates.ACCEPTED)) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.confirmable');
    } else {
      this.billingService.confirmBilling(list);
    }
  }

  regularisationModalClose(action: BillingActions) {
    if (action === BillingActions.ASSOCIATE_REGULARIZATIONS) this.applyFilter();
  }

  private billingClosingAssociation() {
    const list = this.billingList.billingEstablishments?.map(e => e.billing);
    if (list.length === 0) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.no_expanded');
    }
    else if (list.some(e => e.estadoFacturacion !== BillingStates.CONFIRMED)) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.closable');
    } else {
      this.billingService.billingClosingAssociation(list);
    }
  }
  private billingClosingEstablishment() {
    const list = this.billingList.billingEstablishments?.map(e => e.billing);
    if (list.length === 0) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.no_expanded');
    } else if (list.some(e => e.estadoFacturacion !== BillingStates.CONFIRMED)) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.closable');
    } else {
      this.billingService.billingClosingEstablishment(list);
    }
  }

  private printIndividualBilling() {
    const establishment = this.billingList.billingEstablishments?.at(0)?.billing;
    if (!establishment) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.no_expanded');
    }
    else if (establishment.estadoFacturacion !== BillingStates.CLOSED) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.not_printable');
    }
    else {
      this.billingService.printIndividualBilling(establishment);
    }
  }
  private printProvincialBilling() {
    const list = this.billingList.billingEstablishments?.map(e => e.billing);
    if (list.length === 0) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.no_expanded');
    }
    else if (list.some(e => e.estadoFacturacion !== BillingStates.CLOSED)) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.not_printable');
    }
    else {
      this.billingService.printProvincialBilling(list);
    }
  }

  private printGeneralBilling() {
    const list = this.billingList.billingEstablishments?.map(e => e.billing);
    if (list.length === 0) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.no_expanded');
    }
    else if (list.some(e => e.estadoFacturacion !== BillingStates.CLOSED)) {
      this.globalFeedback.showTranslatedWarningMessage('warning.billing.not_printable');
    }
    else {
      this.billingService.printGeneralBilling(list);
    }
  }
}
