import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdminStatus, Modes } from '../../../../bean/constants';
import { Establishment } from '../../../../bean/models/administration';
import { ConstantsService } from '../../../../services/constants.service';
import { EstablishmentDaoService } from '../../../../services/dao/establishment-dao.service';
import { GlobalFeedbackService } from '../../../../services/global-feedback.service';
import { ConfirmModalComponent } from '../../../dispensations/shared/confirm-modal/confirm-modal.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PickListModule } from 'primeng/picklist';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'sacyl-establishment-edit-or-create',
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
  templateUrl: './establishment-edit-or-create.component.html',
  styleUrls: ['./establishment-edit-or-create.component.css']
})
export class EstablishmentEditOrCreateComponent {

  @Input() establishment?: Establishment;

  @Input() mode!: Modes;

  @Output() hide: EventEmitter<void> = new EventEmitter();

  @ViewChild(ConfirmModalComponent) confirmModal!: ConfirmModalComponent;

  submited = false;
  loading = false;

  establishmentForm?: FormGroup;

  establishmentState?: string;

  constructor(
    private constantsService: ConstantsService,
    private establishmentDaoService: EstablishmentDaoService,
    private feedback: GlobalFeedbackService,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.establishmentForm = new FormGroup({
      code: new FormControl<string>({ value: this.establishment?.code || '', disabled: !this.canConfirm }, Validators.required),
      cif: new FormControl<string>({ value: this.establishment?.cif || '', disabled: !this.canConfirm }, Validators.required),
      typeStablishment: new FormControl<string>({
        value: this.establishment?.typeStablishment || '',
        disabled: !this.canConfirm
      }, Validators.required),
      typeProduct: new FormControl<string>({ value: this.establishment?.typeProduct || '', disabled: !this.canConfirm }, Validators.required),
      centerName: new FormControl<string>({ value: this.establishment?.centerName || '', disabled: !this.canConfirm }, Validators.required),
      province: new FormControl<string>({ value: this.establishment?.codeRegion || '', disabled: !this.canConfirm }, Validators.required),
      phone: new FormControl<string>({ value: this.establishment?.phone || '', disabled: !this.canConfirm }),
      address: new FormControl<string>({ value: this.establishment?.address || '', disabled: !this.canConfirm }),
      status: new FormControl<AdminStatus>({
        value: (this.establishment?.dateTo) ? AdminStatus.PASIVE : AdminStatus.ACTIVE,
        disabled: !this.canConfirm
      }),
      billingType: new FormControl({ value: this.establishment?.codeFact || '', disabled: !this.canConfirm }, Validators.required)
    });



  }

  onSubmit() {
    this.submited = true;
    if (this.establishmentForm?.valid) {
      //this.completeConfirm();
      this.confirmModal.show();
    } else {
      this.feedback.showTranslatedWarningMessage('warning.form.missing');
    }
  }

  completeConfirm() {
    const establishment: Establishment = {
      ...this.establishment,
      cif: this.establishmentForm?.get('cif')?.value as string,
      typeStablishment: this.establishmentForm?.get('typeStablishment')?.value as string,
      typeProduct: this.establishmentForm?.get('typeProduct')?.value as string,
      centerName: this.establishmentForm?.get('centerName')?.value as string,
      codeRegion: this.establishmentForm?.get('province')?.value as string,
      descriptionRegion: this.provinces.find(p => p.code === this.establishmentForm?.get('province')?.value)?.description || '',
      phone: this.establishmentForm?.get('phone')?.value as string,
      address: this.establishmentForm?.get('address')?.value as string,
      codeFact: this.establishmentForm?.get('billingType')?.value as string,
      dateTo: this.convertToDate(),
      code: this.establishmentForm?.get('code')?.value as string
    };

    if (this.mode === Modes.CREATE) {
      this.loading = true;

      this.establishmentDaoService.create(establishment).subscribe(data => {
        this.loading = false;
        if (data) this.hide.emit();
        else {
          this.translate.get('error.establishment.create').subscribe(text => {
            this.feedback.showErrorMessage(text);
          });
        }
      });
    } else {
      this.loading = true;
      this.establishmentDaoService.update(establishment).subscribe(data => {
        this.loading = false;
        if (data) this.hide.emit();
        else {
          this.translate.get('error.establishment.update').subscribe(text => {
            this.feedback.showErrorMessage(text);
          });
        }
      });
    }
  }

  required(atr: string) {
    return this.submited && this.canConfirm && this.establishmentForm?.controls[atr].errors !== null;
  }

  convertToDate(): string | undefined {
    const status = this.establishmentForm?.get('status')?.value as AdminStatus | undefined;
    if (status === AdminStatus.PASIVE) {
      return formatDate(new Date(), 'dd/MM/yyyy', 'es');
    }
    return undefined;
  }

  get canConfirm() {
    return this.mode === Modes.CREATE || this.mode === Modes.MODIFY;
  }

  get title() {
    switch (this.mode) {
      case Modes.CONSULT:
        return 'establishment.label.consult';
      case Modes.CREATE:
        return 'establishment.label.creating';
      case Modes.MODIFY:
        return 'establishment.label.editing';
      default:
        return '';
    }
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

  get statusOptions() {
    return Object.values(AdminStatus);
  }

}
