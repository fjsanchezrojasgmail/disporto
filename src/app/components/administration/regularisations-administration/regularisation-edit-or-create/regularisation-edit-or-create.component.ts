import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminStatus, EstablishmentBillingTypes, Modes, RegularisationBalanceCodes, RegularisationBalanceDescription, RegularisationClassificationCodes, RegularisationClassificationDescription, RegularisationStates, RegularisationStatesDescription } from '../../../../bean/constants';
import { Balance, Classification, Establishment, Regularisation } from '../../../../bean/models/administration';
import { BasicItem, BillingType, Province } from '../../../../bean/simple.types';
import { ConstantsService } from '../../../../services/constants.service';
import { EstablishmentDaoService } from '../../../../services/dao/establishment-dao.service';
import { RegularisationDaoService } from '../../../../services/dao/regularisation-dao.service';
import { GlobalFeedbackService } from '../../../../services/global-feedback.service';
import { ConfirmModalComponent } from '../../../dispensations/shared/confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'sacyl-regularisation-edit-or-create',
  standalone: true,
  imports: [
    CommonModule,
    InputNumber,
    ButtonModule,
    TranslateModule,
    DropdownModule,
    TooltipModule,
    ConfirmModalComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './regularisation-edit-or-create.component.html',
  styleUrls: ['./regularisation-edit-or-create.component.css']
})
export class RegularisationEditOrCreateComponent {

  @Input() regularisation?: Regularisation;

  @Input() mode!: Modes;

  @Output() hide: EventEmitter<void> = new EventEmitter();

  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;

  submited = false;
  loading = false;

  regularisationForm?: FormGroup;

  showEstablishmentSelector = false;
  codeEstaBilling = false;
  codeProvBilling = false;
  establishments: Establishment[] = [];

  balanceOptions: Balance[];
  classificationOptions: Classification[];

  constructor(
    private constantsService: ConstantsService,
    private establishmentDaoService: EstablishmentDaoService,
    private feedback: GlobalFeedbackService,
    private regularisationDaoService: RegularisationDaoService
  ) {
    this.classificationOptions = [
      {
        code: RegularisationClassificationCodes.P,
        description: RegularisationClassificationDescription[RegularisationClassificationCodes.P]
      },
      {
        code: RegularisationClassificationCodes.Q,
        description: RegularisationClassificationDescription[RegularisationClassificationCodes.Q]
      }
    ];
    this.balanceOptions = [
      {
        code: RegularisationBalanceCodes.I,
        description: RegularisationBalanceDescription[RegularisationBalanceCodes.I]
      },
      {
        code: RegularisationBalanceCodes.D,
        description: RegularisationBalanceDescription[RegularisationBalanceCodes.D]
      }
    ];
  }

  ngOnInit() {
    this.regularisationForm = new FormGroup({
      province: new FormControl<Province | null>({ value: this.regularisation?.province || null, disabled: !this.canConfirm }, Validators.required),
      billingType: new FormControl<BillingType | null>({
        value: this.regularisation?.billingType || null,
        disabled: !this.canConfirm
      }, Validators.required),
      establishment: new FormControl<string | null>({ value: this.regularisation?.establishmentCode || null, disabled: !this.canConfirm }),
      classification: new FormControl<RegularisationClassificationCodes>({
        value: this.regularisation?.classification || RegularisationClassificationCodes.P,
        disabled: !this.canConfirm
      }, Validators.required),
      code: new FormControl<string | null>({ value: this.regularisation?.code || null, disabled: !this.canConfirm }, Validators.required),
      description: new FormControl<string | null>({
        value: this.regularisation?.description || null, disabled: !this.canConfirm
      }, Validators.required),
      quantity: new FormControl<number | null>({ value: this.regularisation?.quantity || null, disabled: !this.canConfirm }, Validators.required),
      balance: new FormControl<RegularisationBalanceCodes>({
        value: this.regularisation?.balance || RegularisationBalanceCodes.I,
        disabled: !this.canConfirm
      }, Validators.required),
      status: new FormControl<AdminStatus>({
        value: (this.regularisation?.status as AdminStatus) || AdminStatus.ACTIVE,
        disabled: !(this.mode === Modes.MODIFY)
      }),
      state: new FormControl<RegularisationStates>({
        value: this.regularisation?.state || RegularisationStates.PENDING,
        disabled: true
      }, Validators.required)
    });


    if (this.regularisation?.billingType.code === EstablishmentBillingTypes.INDEPENDENT) {
      this.showEstablishmentSelector = true;
      this.updateEstablishmentList();
    }
  }


  confirm() {
    this.submited = true;
    if (this.regularisationForm?.valid) {
      //this.completeConfirm();
      this.confirmModal.show();
    } else {
      this.feedback.showTranslatedWarningMessage('warning.form.missing');
    }
  }

  completeConfirm() {
    const status = this.regularisationForm?.get('status')?.value as AdminStatus | undefined;

    const regularisation: Regularisation = {
      ...this.regularisation,
      code: this.regularisationForm?.get('code')?.value as string,
      description: this.regularisationForm?.get('description')?.value as string,
      balance: this.regularisationForm?.get('balance')?.value as RegularisationBalanceCodes,
      billingType: this.regularisationForm?.get('billingType')?.value as BillingType,
      classification: this.regularisationForm?.get('classification')?.value as RegularisationClassificationCodes,
      province: this.regularisationForm?.get('province')?.value as Province,
      quantity: this.regularisationForm?.get('quantity')?.value as number,
      establishmentCode: this.regularisationForm?.get('establishment')?.value as string || undefined,
      registrationDate: this.regularisation?.registrationDate || new Date(),
      pasiveDate: (status === AdminStatus.PASIVE) ? new Date() : undefined,
      status: status || AdminStatus.ACTIVE,
      state: this.regularisation?.state || RegularisationStates.PENDING
    };

    if (this.mode === Modes.CREATE) {
      this.loading = true;
      this.regularisationDaoService.create(regularisation).subscribe(data => {
        this.loading = false;
        if (data) this.hide.emit();
        else {
          this.feedback.showTranslatedErrorMessage('error.regularisation.create');
        }
      });
    } else {
      this.loading = true;
      this.regularisationDaoService.update(regularisation).subscribe(data => {
        this.loading = false;
        if (data) this.hide.emit();
        else {
          this.feedback.showTranslatedErrorMessage('error.regularisation.update');
        }
      });
    }
  }

  hasError(atr: string) {
    return this.submited && this.canConfirm && this.regularisationForm?.controls[atr].errors !== null;
  }

  checkEstablishments() {
    const type = this.regularisationForm?.get('billingType')?.value as BasicItem;
    if (type.code === EstablishmentBillingTypes.INDEPENDENT) {
      this.updateEstablishmentList();
    }
    else this.showEstablishmentSelector = false;
  }

  updateEstablishmentList() {
    const prov = this.regularisationForm?.get('province')?.value as Province;
    const type = this.regularisationForm?.get('billingType')?.value as BasicItem;
    if (prov && type && type.code === EstablishmentBillingTypes.INDEPENDENT) {
      this.establishmentDaoService.search({ codeRegion: prov.code }).subscribe(data => {
        this.establishments = data || [];
        this.showEstablishmentSelector = true;
        this.regularisationForm?.controls['establishment'].setValidators([Validators.required]);
      });
    } else {
      this.showEstablishmentSelector = false;
      this.regularisationForm?.controls['establishment'].clearValidators();
    }
  }

  get canConfirm() {
    return this.mode === Modes.CREATE || this.mode === Modes.MODIFY;
  }

  get canModify() {
    return this.mode === Modes.MODIFY;
  }

  get title() {
    switch (this.mode) {
      case Modes.CONSULT:
        return 'regularisation.label.consult';
      case Modes.CREATE:
        return 'regularisation.label.creating';
      case Modes.MODIFY:
        return 'regularisation.label.editing';
      default:
        return '';
    }
  }

  get provinces() {
    return this.constantsService.provinces;
  }

  get billingTypes() {
    this.regularisationForm;
    return this.constantsService.billingTypes;
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
