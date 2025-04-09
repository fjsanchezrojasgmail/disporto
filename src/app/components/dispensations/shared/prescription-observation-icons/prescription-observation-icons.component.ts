import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrescriptionRow } from '../../../../bean/models/prescription';
import { CommonModule } from '@angular/common';
import { DefaultTextPipe } from '../../../../pipes/default-text.pipe';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProductObservationIconComponent } from '../product-observation-icon/product-observation-icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Tooltip } from 'primeng/tooltip';
import { faFile } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'sacyl-prescription-observation-icons',
  standalone: true,
    imports: [CommonModule,ButtonModule,TableModule,ProductObservationIconComponent,FontAwesomeModule,Tooltip],
  templateUrl: './prescription-observation-icons.component.html',
  styleUrls: ['./prescription-observation-icons.component.css']
})
export class PrescriptionObservationIconsComponent {

  @Input() prescription!: PrescriptionRow;

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

   get icon() {
      return faFile;
    }
}
