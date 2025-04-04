import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrescriptionTypes } from '../../../../bean/constants';
import { PrescriptionType } from '../../../../bean/models/prescription';
import { Product } from '../../../../bean/models/product';
import { ConstantsService } from '../../../../services/constants.service';
import { aportationCalculation, to2DecimalsNumber } from '../../../../utils/utils';
import { CommonModule } from '@angular/common';
import { DefaultTextPipe } from '../../../../pipes/default-text.pipe';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'sacyl-product-aportation',
  standalone: true,
  imports: [CommonModule,DefaultTextPipe,Tooltip],
  templateUrl: './product-aportation.component.html',
  styleUrls: ['./product-aportation.component.css']
})
export class ProductAportationComponent implements OnChanges {

  @Input() product!: Product;

  @Input() disability!: number;

  @Input() prescriptionType!: PrescriptionType;

  @Input() pharmacyIndicator?: string;

  @Output() readonly valueChange: EventEmitter<void> = new EventEmitter();

  title = '';

  constructor(private translate: TranslateService, private constantsService: ConstantsService) {
    this.translate.get('tooltip.aportation').subscribe(data => this.title = data);
  }

  ngOnChanges() {
    const iva = this.constantsService.getIva(this.disability, this.product.reducedVat);
    const newValue = to2DecimalsNumber(aportationCalculation(this.product, this.hasReimbursement, iva, this.pharmacyIndicator));
    if (this.product.userConsideration.realAportation !== newValue) {
      this.product.userConsideration.realAportation = newValue;
      this.valueChange.emit();
    }
  }

  get aportation() {
    return (this.product.userConsideration.realAportation || 0) * this.product.units.value;
  }

  get hasReimbursement() {
    return this.prescriptionType.code === PrescriptionTypes.REC || this.prescriptionType.code === PrescriptionTypes.REP || this.product.reimbursement;
  }
}
