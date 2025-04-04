import { Component, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Product } from '../../../../bean/models/product';
import { observationSpans } from '../../../../utils/utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'sacyl-product-description',
  standalone: true,
  imports: [CommonModule,TranslateModule,FormsModule,Tooltip],
  templateUrl: './product-description.component.html',
  styleUrls: ['./product-description.component.css']
})
export class ProductDescriptionComponent {

  @Input() product!: Product;

  title = '';

  constructor(private translate: TranslateService) {
    this.translate.get('tooltip.product').subscribe( data => this.title = data);
  }

  get tooltip() {
    let tooltip = `<div class="flex flex-column">` + `<span class="mb-1">${this.product.description}</span>`;
    if (this.product.observations) {
      tooltip = `
      <div class="flex flex-column">` + `<span class="mb-1">${this.product.description}</span>
        <div class="flex">
          <i class="pi pi-file mr-2 color-pending"></i>
          <div class="flex flex-column">
            <span class="font-semibold">${this.title}</span>
            ${observationSpans(this.product.observations)}
          </div>
        </div>
      </div>`
    }
    tooltip += '</div>'
    return tooltip;
  }
}
