import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BillingActions } from '../../../bean/constants';
import { RegularisationCodes } from '../../../bean/models/administration';
import { BillingGeneralFilter } from '../../../bean/models/billing';
import { RegularisationDaoService } from '../../../services/dao/regularisation-dao.service';
import { BillingPendingRegularisationsComponent } from './billing-pending-regularisations/billing-pending-regularisations.component';
import { BillingRelatedRegularisationsComponent } from './billing-related-regularisations/billing-related-regularisations.component';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sacyl-billing-regularisations',
  standalone: true,
  imports: [CommonModule,DialogModule,ButtonModule,TranslateModule,
    BillingRelatedRegularisationsComponent,BillingPendingRegularisationsComponent],
  templateUrl: './billing-regularisations.component.html',
  styleUrls: ['./billing-regularisations.component.css']
})
export class BillingRegularisationsComponent {

  @ViewChild(BillingPendingRegularisationsComponent) pending?: BillingPendingRegularisationsComponent;
  @ViewChild(BillingRelatedRegularisationsComponent) related?: BillingRelatedRegularisationsComponent;

  @Input() generalFilter!: BillingGeneralFilter;

  @Output() confirmation: EventEmitter<void> = new EventEmitter();

  @Output() close: EventEmitter<BillingActions> = new EventEmitter();

  display = false;

  codes: RegularisationCodes = {};

  action: BillingActions = BillingActions.CONSULT_REGULARIZATIONS;

  constructor(private regularisationDao: RegularisationDaoService) { }

  show(action: BillingActions, codes: RegularisationCodes) {
    this.action = action;
    this.codes = codes;
    this.display = true;
    if (this.pending) this.pending.fetchPendingRegularizations();
    if (this.related) this.related.fetchRelatedRegularizations(this.codes);
  }

  confirm() {
    this.confirmation.emit();
    this.display = false;
  }

  onHide() {
    this.close.emit(this.action);
  }

  associate() {
    if (this.pending) {
      const regs = this.pending.list.filter(r => r.check).filter(r => r.id !== undefined).map(r => r.id!);
      this.regularisationDao.associate({
        codFacturaEstablecimiento: this.codes.facturacionEstablecimientoCode,
        codFacturacionProvincial: this.codes.facturacionProvincialCode,
        listCodRegularizaciones: regs
        //fechaRegistro: formatDate(new Date(), 'dd/MM/yyyy HH:mm:SS', 'es')
      }).subscribe(() => {
        this.pending?.fetchPendingRegularizations();
        this.related?.fetchRelatedRegularizations(this.codes);
      });
    }

  }

  get canAssociate() {
    return this.action === BillingActions.ASSOCIATE_REGULARIZATIONS;
  }

  get canConfirm() {
    return this.action === BillingActions.CONFIRM_BILLING;
  }

}
