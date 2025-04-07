import { Component, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { AdminActions, AdminStatus, Modes, RegularisationBalanceCodes, RegularisationBalanceDescription, RegularisationStates, RegularisationStatesDescription, undefinedStringToDate } from '../../../bean/constants';
import { Regularisation } from '../../../bean/models/administration';

import { SortMeta } from 'primeng/api';
import { GlobalFeedbackService } from '../../../services/global-feedback.service';
import { RegularisationDaoService } from '../../../services/dao/regularisation-dao.service';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from 'primeng/sidebar';
import { AdminActionsButtonComponent } from '../shared/admin-actions-button/admin-actions-button.component';
import { RegularisationEditOrCreateComponent } from './regularisation-edit-or-create/regularisation-edit-or-create.component';
import { NoResultsComponent } from '../../shared/no-results/no-results.component';

@Component({
  selector: 'sacyl-regularisations-administration',
  standalone: true,
  imports:[
    CommonModule,
    ButtonModule,
    TableModule,
    DropdownModule,
    TranslateModule,
    SidebarModule,
    AdminActionsButtonComponent,
    RegularisationEditOrCreateComponent,
    NoResultsComponent
  ],
  templateUrl: './regularisations-administration.component.html',
  styleUrls: ['./regularisations-administration.component.css']
})
export class RegularisationsAdministrationComponent {

  @ViewChild(Table) dt!: Table;

  list: Regularisation[] = [];

  editing = Modes.MODIFY;
  consulting = Modes.CONSULT;
  creating = Modes.CREATE;

  currentMode?: Modes;

  regularisation?: Regularisation;

  loading = false;
  activePasiveDefault = 'Activo';
  pendingAssociatedDefault = 'Pendiente';
  today = new Date();
  sortArray: SortMeta[] = [
    { field: 'state', order: -1 },
    { field: 'pasiveDate', order: -1 }
  ];

  constructor(private regularisationService: RegularisationDaoService,
    private feedback: GlobalFeedbackService) {
    this.fetchRegularisations();
  }


  applyInputFilter($event: EventTarget | null, field: string, operation: string) {
    this.dt.filter(($event as HTMLInputElement).value, field, operation);
  }

  applyInitialFilter(value: string, field: string, operation: string) {
    this.dt.filter(value, field, operation);
  }

  applyComboFilter($event: DropdownChangeEvent & { value: string }, field: string, operation: string) {
    this.dt.filter($event.value, field, operation);
  }

  fetchRegularisations() {
    this.loading = true;
    this.regularisationService.search({}).subscribe(data => {
      this.loading = false;
      data.forEach(regularisation => {
        if (regularisation.pasiveDate == undefined) {
          regularisation.pasiveDate = undefinedStringToDate(regularisation.pasiveDate);
        }
      });
      this.list = data;
    });
  }

  menuAction(reg: Regularisation, action: AdminActions) {
    switch (action) {
      case AdminActions.DETAILS:
        this.consult(reg);
        break;
      case AdminActions.MODIFY:
        if (reg.state === RegularisationStates.PENDING) this.edit(reg);
        else {
          this.feedback.showTranslatedWarningMessage('warning.regularisation.not_editable');
        }
        break;
      default:
        break;
    }
  }

  edit(reg: Regularisation) {
    this.regularisation = reg;
    this.currentMode = this.editing;
  }

  consult(reg: Regularisation) {
    this.regularisation = reg;
    this.currentMode = this.consulting;

  }

  create() {
    this.regularisation = undefined;
    this.currentMode = this.creating;
  }

  onHide() {
    this.currentMode = undefined;
    this.fetchRegularisations();
  }

  get balanceOptions() {
    return Object.values(RegularisationBalanceCodes);
  }

  balanceInfo(code: RegularisationBalanceCodes) {
    return RegularisationBalanceDescription[code] || '';
  }

  get stateOptions() {
    return Object.values(RegularisationStates);
  }

  stateInfo(code: RegularisationStates) {
    return RegularisationStatesDescription[code] || '';
  }

  get statusOptions() {
    return Object.values(AdminStatus);
  }
}
