import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { BillingActions } from '../../../bean/constants';
import { ProfesionalActions } from '../../../bean/models/profesional';
import { ProfesionalService } from '../../../services/helpers/profesional/profesional.service';
import { PdfService } from '../../../services/helpers/pdf.service';
import { CommonModule } from '@angular/common';
import { Menu } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DefaultTextPipe } from '../../../pipes/default-text.pipe';

@Component({
  selector: 'sacyl-billing-actions',
  standalone: true,
  imports: [CommonModule,Menu,ButtonModule,DefaultTextPipe],
  templateUrl: './billing-actions.component.html',
  styleUrls: ['./billing-actions.component.css']
})
export class BillingActionsComponent {

  @Input() loading: boolean | null = false;

  @Output() readonly menuAction: EventEmitter<BillingActions> = new EventEmitter();

  items: MenuItem[];

  canConsultReg = false;

  closing = '';
  accept_establishment_billing = '';
  accept_provincial_billing = '';
  associate_regularizations = '';
  confirm_billing = '';
  billing_closing = '';
  individual_billing = '';
  provincial_billing = '';
  general_billing = '';

  constructor(private translate: TranslateService, private profesionalService: ProfesionalService, public pdfService: PdfService) {
    this.translate.get('billing.action.closing').subscribe(data => this.closing = data);
    this.translate.get('billing.action.accept_establishment_billing').subscribe(data => this.accept_establishment_billing = data);
    this.translate.get('billing.action.accept_provincial_billing').subscribe(data => this.accept_provincial_billing = data);
    this.translate.get('billing.action.associate_regularizations').subscribe(data => this.associate_regularizations = data);
    this.translate.get('billing.action.confirm_billing').subscribe(data => this.confirm_billing = data);
    this.translate.get('billing.action.billing_closing').subscribe(data => this.billing_closing = data);
    this.translate.get('billing.action.individual_billing').subscribe(data => this.individual_billing = data);
    this.translate.get('billing.action.provincial_billing').subscribe(data => this.provincial_billing = data);
    this.translate.get('billing.action.general_billing').subscribe(data => this.general_billing = data);
    this.items = [];
    this.profesionalService.billingActions$.subscribe(actions => this.updateActions(actions));
  }

  runFirstCommand() {
    if (this.items[0] && this.items[0].command) {
      this.items[0].command;
    }
  }

  private updateActions(actions: BillingActions[]) {
    this.items = [];
    this.canConsultReg = false;
    if (actions.includes(BillingActions.GENERATE_CLOSING)) {
      this.items.push({ label: this.closing, command: () => { this.menuAction.emit(BillingActions.GENERATE_CLOSING); } });
    }
    if (actions.includes(BillingActions.ACCEPT_ESTABLISHMENT_BILLING)) {
      this.items.push({
        label: this.accept_establishment_billing,
        command: () => { this.menuAction.emit(BillingActions.ACCEPT_ESTABLISHMENT_BILLING); }
      });
    }
    if (actions.includes(BillingActions.ACCEPT_PROVINCIAL_BILLING)) {
      this.items.push({ label: this.accept_provincial_billing, command: () => { this.menuAction.emit(BillingActions.ACCEPT_PROVINCIAL_BILLING); } });
    }
    if (actions.includes(BillingActions.ASSOCIATE_REGULARIZATIONS)) {
      this.items.push({ label: this.associate_regularizations, command: () => { this.menuAction.emit(BillingActions.ASSOCIATE_REGULARIZATIONS); } });
    }
    if (actions.includes(BillingActions.CONFIRM_BILLING)) {
      this.items.push({ label: this.confirm_billing, command: () => { this.menuAction.emit(BillingActions.CONFIRM_BILLING); } });
    }
    if (actions.includes(BillingActions.BILLING_CLOSING_ASSOCIATION)) {
      this.items.push({ label: this.billing_closing, command: () => { this.menuAction.emit(BillingActions.BILLING_CLOSING_ASSOCIATION); } });
    }
    if (actions.includes(BillingActions.BILLING_CLOSING_ESTABLISHMENT)) {
      this.items.push({ label: this.billing_closing, command: () => { this.menuAction.emit(BillingActions.BILLING_CLOSING_ESTABLISHMENT); } });
    }
    if (actions.includes(BillingActions.PRINT_INDIVIDUAL_BILLING)) {
      this.items.push({ label: this.individual_billing, command: () => { this.menuAction.emit(BillingActions.PRINT_INDIVIDUAL_BILLING); } });
    }
    if (actions.includes(BillingActions.PRINT_PROVINCIAL_BILLING)) {
      this.items.push({ label: this.provincial_billing, command: () => { this.menuAction.emit(BillingActions.PRINT_PROVINCIAL_BILLING); } });
    }
    if (actions.includes(BillingActions.PRINT_GENERAL_BILLING)) {
      this.items.push({ label: this.general_billing, command: () => { this.menuAction.emit(BillingActions.PRINT_GENERAL_BILLING); } });
    }
    if (actions.includes(BillingActions.CONSULT_REGULARIZATIONS)) {
      this.canConsultReg = true;
    }
  }

  checkRegularisations() {
    this.menuAction.emit(BillingActions.CONSULT_REGULARIZATIONS);
  }
}
