import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCopyright as fasCopyright } from '@fortawesome/free-solid-svg-icons';
import { Product } from '../../../../bean/models/product';
import { ConstantsService } from '../../../../services/constants.service';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'sacyl-brand-icon',
  standalone: true,
  imports: [CommonModule,ButtonModule,Tooltip,TranslateModule,FontAwesomeModule],
  templateUrl: './brand-icon.component.html',
  styleUrls: ['./brand-icon.component.css']
})
export class BrandIconComponent {

  @Input() products!: Product[];

  @Input() disabled!: boolean;

  @Output() pushed: EventEmitter<void> = new EventEmitter();

  constructor(private constantsService: ConstantsService) { }

  get noBrand() {
    return !this.disabled &&
      this.constantsService.selectCommercialBrand &&
      this.products.some(p => !(p.prescriptionBrand && !p.replaceable));

    //Se esconde el boton siempre
    // hay marca prescrita y no es rempazable/sustituible
  }

  get tooltip() {
    if (this.products.some(p => p.replaceable)) return 'tooltip.brand.replace';
    else return 'tooltip.brand.missing';
  }

  get icon() {
    if (this.products.some(p => p.replaceable)) return fasCopyright;
    else return fasCopyright;
  }
}
