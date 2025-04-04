import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PrescriptionState } from '../../../../bean/constants';
import { Product } from '../../../../bean/models/product';
import { ConstantsService } from '../../../../services/constants.service';
import { pvpError, to2DecimalsNumber } from '../../../../utils/utils';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sacyl-pvp-input',
  standalone: true,
  imports: [CommonModule,InputNumber,FormsModule,Tooltip,TranslateModule],
  templateUrl: './pvp-input.component.html',
  styleUrls: ['./pvp-input.component.css']
})
export class PvpInputComponent implements OnChanges {

  @Input() product!: Product;

  @Input() consider = false;

  @Input() disability!: number;

  @Input() state!: PrescriptionState;

  @Input() disable = false;

  @Output() readonly valueChange: EventEmitter<void> = new EventEmitter();

  tooltipInfo = '';
  tooltipDefaultInfo = '';

  constructor(private translate: TranslateService,
    private constantsService: ConstantsService) {
    translate.get('tooltip.pvp.info').subscribe(data => this.tooltipInfo = data);
    translate.get('tooltip.pvp.no_tax_value').subscribe(data => this.tooltipDefaultInfo = data);
  }


  ngOnChanges() {
    if (this.product.pvp.value && !this.product.pvp?.valueTax) this.change(this.product.pvp.value);
  }

  get disabledInput() {
    return ![PrescriptionState.PRESC_PDTE_DISPENSAR, PrescriptionState.PRESC_RESERVADA].includes(this.state);
  }

  get error() {
    let result = pvpError(this.product);
    if (this.constantsService.selectCommercialBrand) result = result && this.product.brand?.pvp !== undefined;
    return result && this.consider;
  }

  get tooltipInfoPvp() {
    if (this.product.pvp?.valueTax)
      return this.tooltipInfo
        + '(' + this.constantsService.getIvaPercentage(this.disability, this.product.reducedVat) + '): '
        + this.product.pvp.valueTax?.toString() + '€';
    return this.tooltipDefaultInfo;
  }

  change(pvp: number) {
    const iva = this.constantsService.getIva(this.disability, this.product.reducedVat);
    const valueTax = (pvp) ? to2DecimalsNumber(iva * pvp) : undefined;
    this.product.pvp.value = pvp || undefined;
    this.product.pvp.valueTax = valueTax;
    this.product.pvp.tax = iva;
    this.product.pvp.total = to2DecimalsNumber((this.product.units.value) * (valueTax || 0));
    this.valueChange.emit();
  }
}
