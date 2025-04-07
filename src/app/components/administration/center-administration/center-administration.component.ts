import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Table, TableModule } from 'primeng/table';
import { AdminActions, AdminStatus, Modes } from '../../../bean/constants';
import { Establishment } from '../../../bean/models/administration';
import { EstablishmentDaoService } from '../../../services/dao/establishment-dao.service';
import { ConstantsService } from '../../../services/constants.service';
import { EstablishmentTypeDaoService } from '../../../services/dao/establishment-type-dao.service';
import { EstablishmentBillingTypeDaoService } from '../../../services/dao/establishment-billingType-dao.service';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickListModule } from 'primeng/picklist';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { AdminActionsButtonComponent } from '../shared/admin-actions-button/admin-actions-button.component';
import { EstablishmentEditOrCreateComponent } from './establishment-edit-or-create/establishment-edit-or-create.component';
import { NoResultsComponent } from '../../shared/no-results/no-results.component';
import { SidebarModule } from 'primeng/sidebar';
import { forkJoin } from 'rxjs';


type EstablishmentRow = Establishment & {
  typeDescription: string;
  billingDescription: string;
  status: AdminStatus;
}

@Component({
  selector: 'sacyl-center-administration',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    TableModule,
    TooltipModule,
    InputNumberModule,
    DropdownModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    PickListModule,
    ProgressSpinnerModule,
    ButtonModule,
    AdminActionsButtonComponent,
    EstablishmentEditOrCreateComponent,
    NoResultsComponent,
    SidebarModule
  ],
  templateUrl: './center-administration.component.html',
  styleUrls: ['./center-administration.component.css']
})
export class CenterAdministrationComponent {

  @ViewChild(Table) dt!: Table;

  list: EstablishmentRow[] = [];

  loading = true;
  editing = Modes.MODIFY;
  editingLabel = '';

  consulting = Modes.CONSULT;
  consultingLabel = '';

  creating = Modes.CREATE;

  currentMode?: Modes;
  establishment?: Establishment;
  tipoEstablecimiento: string[] = [];
  tipoFacturacion: string[] = [];

  constructor(
    private establishmentService: EstablishmentDaoService,
    private translate: TranslateService,
    private ref: ChangeDetectorRef,
    private constantsService: ConstantsService) {

    /*translate.get('button.edit').subscribe(data => this.editingLabel = data);
    translate.get('button.consult').subscribe(data => this.consultingLabel = data);*/
  }

  ngOnInit() {
    this.fetchEstablishments();

    forkJoin({
          edit: this.translate.get('button.edit'),
          consult: this.translate.get('button.consult'),
        }).subscribe(translations => {
         
          this.editingLabel = translations.edit,
          this.consultingLabel = translations.consult
          this.ref.detectChanges(); // solo si estás teniendo problemas de renderizado
        });
    

  }

  applyInputFilter($event: EventTarget | null, field: string, operation: string) {
    this.dt.filter(($event as HTMLInputElement).value, field, operation);
  }

  applyComboFilter($event: DropdownChangeEvent & { value: string }, field: string, operation: string) {
    this.dt.filter($event.value, field, operation);
  }

  fetchEstablishments() {
    this.loading = true;
    this.establishmentService.search({}).subscribe(data => {
      this.list = data.map(e => <EstablishmentRow>{
        ...e,
        typeDescription: this.constantsService.establishmentTypes.find(t => t.code === e.typeStablishment)?.description || '',
        billingDescription: this.constantsService.billingTypes.find(t => t.code === e.codeFact)?.description || '',
        status: (e.dateTo) ? AdminStatus.PASIVE : AdminStatus.ACTIVE
      });
      this.loading = false;
    });
  }

  menuAction(est: EstablishmentRow, action: AdminActions) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { typeDescription, billingDescription, status, ...establishment } = est;

    switch (action) {
      case AdminActions.DETAILS:
        this.consult(establishment);
        break;
      case AdminActions.MODIFY:
        this.edit(establishment);
        break;
      default:
        break;
    }
  }

  edit(est: Establishment) {
    this.establishment = est;
    this.currentMode = this.editing;
  }

  consult(est: Establishment) {
    this.establishment = est;
    this.currentMode = this.consulting;
  }

  create() {
    this.establishment = undefined;
    this.currentMode = this.creating;
  }

  onHide() {
    this.currentMode = undefined;
    this.fetchEstablishments();
  }

  get statusOptions() {
    return Object.values(AdminStatus);
  }
  get provinces() {
    return this.constantsService.provinces;
  }
  get types() {
    return this.constantsService.establishmentTypes;
  }
  get productTypes() {
    return this.constantsService.productTypes;
  }
  get billingTypes() {
    return this.constantsService.billingTypes;
  }

  get establishmentStates() {

    return [{ 'code': '0', 'description': 'Activo' }, { 'code': '1', 'description': 'Pasivo' }];

  }
}
