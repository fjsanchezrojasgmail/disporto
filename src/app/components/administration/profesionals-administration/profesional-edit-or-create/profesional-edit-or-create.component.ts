import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PickList, PickListModule } from 'primeng/picklist';
import { BehaviorSubject } from 'rxjs';
import { AdminStatus, Modes, ProfesionalTypes } from '../../../../bean/constants';
import { Establishment } from '../../../../bean/models/administration';
import { ProfesionalAdm } from '../../../../bean/models/profesional';
import { Province } from '../../../../bean/simple.types';
import { ConstantsService } from '../../../../services/constants.service';
import { EstablishmentDaoService } from '../../../../services/dao/establishment-dao.service';
import { ProfesionalDaoService } from '../../../../services/dao/profesional-dao.service';
import { GlobalFeedbackService } from '../../../../services/global-feedback.service';
import { ProfesionalService } from '../../../../services/helpers/profesional/profesional.service';
import { CustomValidators } from '../../../../utils/validators';
import { ConfirmModalComponent } from '../../../dispensations/shared/confirm-modal/confirm-modal.component';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'sacyl-profesional-edit-or-create',
  standalone: true,
 imports: [
  CommonModule,
  CheckboxModule,
  TooltipModule,
  InputNumberModule,
  DropdownModule,
  TranslateModule,
  FormsModule,
  ReactiveFormsModule,
  PickListModule,
  ProgressSpinnerModule,
  ButtonModule,
  ConfirmModalComponent,
],
  templateUrl: './profesional-edit-or-create.component.html',
  styleUrls: ['./profesional-edit-or-create.component.css']
})
export class ProfesionalEditOrCreateComponent {

  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;
  @ViewChild('plEstablishments') plEstablishments?: PickList;
  @ViewChild('plProvinces') plProvinces?: PickList;

  @Input() profesional?: ProfesionalAdm;

  @Input() mode!: Modes;

  @Output() hide: EventEmitter<void> = new EventEmitter();

  submited = false;
  loading = false;

  loadingEstablishments = new BehaviorSubject<boolean>(false);
  search = '';

  profesionalForm?: FormGroup;

  establishmentType = ProfesionalTypes.DISPENSER_ESTABLISHMENT;

  establihsmentSourceTable: Establishment[] = [];
  establihsmentTargetTable: Establishment[] = [];

  provinceSourceTable: Province[] = [];
  provinceTargetTable: Province[] = [];

  constructor(private constantsService: ConstantsService,
    private profesionalService: ProfesionalService,
    private establishmentDaoService: EstablishmentDaoService,
    private profesionalDaoService: ProfesionalDaoService,
    private feedback: GlobalFeedbackService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.profesionalForm = new FormGroup({
      name: new FormControl({ value: this.profesional?.name || '', disabled: !this.canConfirm }, Validators.required),
      surname1: new FormControl({ value: this.profesional?.surname1 || '', disabled: !this.canConfirm }, Validators.required),
      surname2: new FormControl({ value: this.profesional?.surname2 || '', disabled: !this.canConfirm }),
      phone: new FormControl({ value: this.profesional?.phone || '', disabled: !this.canConfirm }, CustomValidators.phoneValidator),
      dni: new FormControl({ value: this.profesional?.dni || '', disabled: !this.canConfirm }, [Validators.required, CustomValidators.dniValidator]),
      type: new FormControl({ value: this.profesional?.typeProfesional, disabled: !this.canConfirm }, Validators.required),
      holder: new FormControl({ value: this.profesional?.titular === 'S', disabled: !this.canConfirm }),
      billingPermission: new FormControl({ value: this.profesional?.permissionFac === 'S', disabled: !this.canConfirm }),
      status: new FormControl<AdminStatus>({
        value: (this.profesional?.dateTo) ? AdminStatus.PASIVE : AdminStatus.ACTIVE,
        disabled: !(this.mode === Modes.MODIFY)
      })
      //establishments: new FormControl({ value: this.profesional?.listEstablecimientos?.map(p => p.code) || [], disabled: !this.canConfirm }),
      //provinces: new FormControl({ value: this.profesional?.provinces?.map(p => p.code) || [], disabled: !this.canConfirm })
    });
    this.fillPickTables();
  }

  filterEstablishments() {
    this.loadingEstablishments.next(true);
    if (this.search.length > 0) {
      this.establishmentDaoService.search({ code: this.search }).subscribe(data => {
        let result: Establishment[] = [];
        if (data) result = [...data];
        this.establihsmentSourceTable = result;

        this.loadingEstablishments.next(false);
      });
    } else {
      this.loadingEstablishments.next(true);
    }
  }

  confirm() {
    this.submited = true;
    if (this.profesionalForm?.valid && this.checkPickList()) {
      //this.completeConfirm();
      this.confirmModal.show();
    } else {
      this.feedback.showTranslatedWarningMessage('warning.form.missing');
    }
  }

  completeConfirm() {
    if (this.loading) return;
    const profesional: ProfesionalAdm = {
      ...this.profesional,
      dni: this.profesionalForm?.get('dni')?.value as string,
      name: this.profesionalForm?.get('name')?.value as string,
      surname1: this.profesionalForm?.get('surname1')?.value as string,
      surname2: this.profesionalForm?.get('surname2')?.value as string,
      permissionFac: (this.profesionalForm?.get('billingPermission')?.value as boolean) ? 'S' : 'N',
      provinces: this.provinceTargetTable,
      dateTo: this.convertToDate(),
      listEstablecimientos: this.establihsmentTargetTable,
      titular: (this.profesionalForm?.get('holder')?.value as boolean) ? 'S' : 'N',
      typeProfesional: this.profesionalForm?.get('type')?.value as string,
      phone: (this.profesionalForm?.get('phone')?.value as number).toString()
    };
    if (this.mode === Modes.CREATE) {
      this.loading = true;
      this.profesionalDaoService.create(profesional).subscribe(data => {
        this.loading = false;
        if (data) this.hide.emit();
        else {
          this.translate.get('error.profesional.create').subscribe(text => {
            this.feedback.showErrorMessage(text);
          });
        }
      });
    } else {
      this.loading = true;
      this.profesionalDaoService.update(profesional).subscribe(data => {
        this.loading = false;
        if (data) this.hide.emit();
        else {
          this.translate.get('error.profesional.update').subscribe(text => {
            this.feedback.showErrorMessage(text);
          });
        }
      });
    }
  }

  hasError(atr: string) {
    const control = this.profesionalForm?.controls[atr];
    return (this.submited || control?.invalid) && this.canConfirm && control && control.errors !== null;
  }

  hasProvinces() {
    return this.submited && this.canConfirm && this.provinceTargetTable.length === 0;
  }

  hasEstablishment() {
    return this.submited && this.canConfirm && this.establihsmentTargetTable.length === 0;
  }

  checkPickList() {
    const field = this.profesionalForm?.get('type')?.value as ProfesionalTypes | undefined;
    if (field === this.establishmentType) {
      return !this.hasEstablishment();
    } else if (field !== undefined && field !== null) {
      return !this.hasProvinces();
    } else return false;
  }

  fillPickTables() {
    if (this.profesional) {
      this.profesionalDaoService.details({ dni: this.profesional.dni }).subscribe(prof => {
        this.establihsmentTargetTable = prof?.listEstablecimientos || [];
        const currentProfesionalProvinces = prof?.provinces || [];
        this.provinceSourceTable = this.constantsService.provinces.filter(p => !currentProfesionalProvinces.some(c => c.code === p.code));
        this.provinceTargetTable = currentProfesionalProvinces;
      });
    } else {
      this.provinceSourceTable = this.constantsService.provinces;
    }
  }

  convertToDate(): string | undefined {
    const status = this.profesionalForm?.get('status')?.value as AdminStatus | undefined;
    if (status === AdminStatus.PASIVE) {
      return formatDate(new Date(), 'dd/MM/yyyy', 'es');
    }
    return undefined;
  }

  get canConfirm() {
    return this.mode === Modes.CREATE || this.mode === Modes.MODIFY;
  }

  get profesionalFormType() {
    return this.profesionalForm?.get('type')?.value;
  }

  get title() {
    switch (this.mode) {
      case Modes.CONSULT:
        return 'profesional.label.consult';
      case Modes.CREATE:
        return 'profesional.label.creating';
      case Modes.MODIFY:
        return 'profesional.label.editing';
      default:
        return '';
    }
  }

  get provinces() {
    return this.constantsService.provinces;
  }

  get dniError() {
    const err = this.profesionalForm?.controls['dni'].errors;
    if (err && err['invalidDni']) return 'validation.error.dni';
    return 'dropdown.missing_error';
  }

  get profesionalTypes() {
    if ([ProfesionalTypes.ASSOCIATION,
    ProfesionalTypes.CONCYL,
    ProfesionalTypes.PROVINCIAL_COLLEGE].includes(this.profesionalService.profesional.typeProfesional as ProfesionalTypes)) {
      return this.constantsService.profesionalTypes.filter(t => t.code === ProfesionalTypes.DISPENSER_ESTABLISHMENT);
    }
    return this.constantsService.profesionalTypes;
  }

  get statusOptions() {
    return Object.values(AdminStatus);
  }

  get types() {
    return this.constantsService.profesionalTypes;
  }

}
