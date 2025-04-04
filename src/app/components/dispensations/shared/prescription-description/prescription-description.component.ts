import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Prescription } from '../../../../bean/models/prescription';
import { CommonModule } from '@angular/common';
import { ProductDescriptionComponent } from '../product-description/product-description.component';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'sacyl-prescription-description',
  standalone: true,
  imports: [CommonModule,ProductDescriptionComponent,Tooltip],
  templateUrl: './prescription-description.component.html',
  styleUrls: ['./prescription-description.component.css']
})
export class PrescriptionDescriptionComponent {

  @Input() prescription!: Prescription;

  title = '';

  constructor(private translate: TranslateService) {
    this.translate.get('tooltip.prescription').subscribe( data => this.title = data);
  }

  get tooltip() {
    let tooltip = undefined;
    tooltip = `<div class="flex flex-column">` + `<span class="mb-1">${this.prescription.description}</span>`;
    if (this.prescription.observation) {
      tooltip += `
        <div class="flex">
          <i class="pi pi-file mr-2"></i>
          <div class="flex flex-column">
            <span class="font-semibold">${this.title}</span>
            <span>${this.prescription.observation}</span>
          </div>
        </div>`
    }
    tooltip += '</div>'
    return tooltip;
  }
}
