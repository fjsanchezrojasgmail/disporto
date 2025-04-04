import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Product } from '../../../../bean/models/product';
import { observationSpans } from '../../../../utils/utils';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'sacyl-product-observation-icon',
  standalone: true,
  imports: [CommonModule,Tooltip],
  templateUrl: './product-observation-icon.component.html',
  styleUrls: ['./product-observation-icon.component.css']
})
export class ProductObservationIconComponent {
  @Input() product!: Product;

  title = '';

  constructor(private translate: TranslateService) {
    this.translate.get('tooltip.product').subscribe(data => this.title = data);
  }

  get tooltip() {
    let tooltip = undefined;
    tooltip = '<div class="flex flex-column">' + `<span class="mb-1">${this.product.description}</span>`;
    if (this.product.observation) {
      tooltip += `
        <div class="flex">
          <i class="pi pi-file mr-2 color-pending"></i>
          <div class="flex flex-column">
            <span class="font-semibold">${this.title}</span>
            ${observationSpans([this.product.observation])}
          </div>
        </div>`;
    }
    tooltip += '</div>';
    return tooltip;
  }
}
