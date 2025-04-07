import { Component, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Table, TableModule } from 'primeng/table';
import { AdminActions, AdminStatus, Modes, ProfesionalTypes, stringToBoolean } from '../../../bean/constants';
import { ProfesionalAdm } from '../../../bean/models/profesional';
import { GlobalFeedbackService } from '../../../services/global-feedback.service';
import { ProfesionalService } from '../../../services/helpers/profesional/profesional.service';
import { ConstantsService } from '../../../services/constants.service';
import { ProfesionalTypeDaoService } from '../../../services/dao/profesional-type-dao.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminActionsButtonComponent } from '../shared/admin-actions-button/admin-actions-button.component';
import { SidebarModule } from 'primeng/sidebar';
import { ProfesionalEditOrCreateComponent } from './profesional-edit-or-create/profesional-edit-or-create.component';
import { NoResultsComponent } from '../../shared/no-results/no-results.component';


type ProfesionalRow = ProfesionalAdm & {
  status: AdminStatus,
  typeDescription: string;
}

@Component({
  selector: 'sacyl-profesionals-administration',
  standalone: true,
  imports: [
      CommonModule,
      ButtonModule,
      TableModule,
      TranslateModule,
      DropdownModule,
      TooltipModule,
      FormsModule,
      ReactiveFormsModule,
      AdminActionsButtonComponent,
      SidebarModule,
      ProfesionalEditOrCreateComponent,
      NoResultsComponent
    ],
  templateUrl: './profesionals-administration.component.html',
  styleUrls: ['./profesionals-administration.component.css']
})
export class ProfesionalsAdministrationComponent {
  @ViewChild(Table) dt!: Table;

  list: ProfesionalRow[] = [];

  editing = Modes.MODIFY;
  consulting = Modes.CONSULT;
  creating = Modes.CREATE;
  loading = true;

  currentMode?: Modes;
  profesional?: ProfesionalAdm;

  constructor(private profesionalService: ProfesionalService,
    private translate: TranslateService,
    private constantsService: ConstantsService,
    private feedback: GlobalFeedbackService) {
  }


  ngOnInit() {
    this.fetchProfesionals();
  }

  applyInputFilter($event: EventTarget | null, field: string, operation: string) {
    this.dt.filter(($event as HTMLInputElement).value, field, operation);
  }

  applyComboFilter($event: DropdownChangeEvent & { value: string }, field: string, operation: string) {
    this.dt.filter($event.value, field, operation);
  }

  fetchProfesionals() {
    this.loading = true;
    this.profesionalService.searchProfesional().subscribe(data => {
      this.list = data.map(p => {
        return <ProfesionalRow>{
          ...p,
          typeDescription: this.constantsService.profesionalTypes.find(t => t.code === p.typeProfesional)?.description || '',
          status: (p.dateTo) ? AdminStatus.PASIVE : AdminStatus.ACTIVE
        };
      });
      this.loading = false;
    });
  }

  menuAction(pro: ProfesionalRow, action: AdminActions) {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { typeDescription, status, ...profesional } = pro;
    switch (action) {
      case AdminActions.DETAILS:
        this.consult(profesional);
        break;
      case AdminActions.MODIFY:
        this.edit(profesional);
        break;
      default:
        break;
    }
  }

  edit(pro: ProfesionalAdm) {
    if ([ProfesionalTypes.ASSOCIATION,
    ProfesionalTypes.CONCYL,
    ProfesionalTypes.PROVINCIAL_COLLEGE].includes(this.profesionalService.profesional.typeProfesional as ProfesionalTypes)) {
      if (pro.typeProfesional === ProfesionalTypes.DISPENSER_ESTABLISHMENT) {
        this.profesional = pro;
        this.currentMode = this.editing;
      } else {
        this.feedback.showTranslatedWarningMessage('warning.profesional.cant_edit');
      }
    } else {
      this.profesional = pro;
      this.currentMode = this.editing;
    }

  }

  consult(p: ProfesionalAdm) {
    this.profesionalService.consultProfesional(p.dni).subscribe(prof => {
      this.profesional = prof || undefined;
      if (prof) this.currentMode = this.consulting;
      else this.translate.get('error.profesional.details').subscribe(text => this.feedback.showErrorMessage(text));
    });
  }

  create() {
    this.profesional = undefined;
    this.currentMode = this.creating;
  }

  onHide() {
    this.currentMode = undefined;
    this.fetchProfesionals();
  }

  get types() {
    return this.constantsService.profesionalTypes;
  }

  get statusOptions() {
    return Object.values(AdminStatus);
  }
}
