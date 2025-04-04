import { Component, Input } from '@angular/core';
import { Prescription } from '../../../../../bean/models/prescription';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { Tooltip } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ProductDescriptionComponent } from '../../product-description/product-description.component';
import { LateralityComponent } from '../../laterality/laterality.component';

@Component({
  selector: 'sacyl-prescription-product-list',
  standalone: true,
    imports: [CommonModule,CheckboxModule,Tooltip,FormsModule,TranslateModule,TableModule,ProductDescriptionComponent,LateralityComponent],
  templateUrl: './prescription-product-list.component.html',
  styleUrls: ['./prescription-product-list.component.css']
})
export class PrescriptionProductListComponent {

  @Input() prescription!: Prescription;
}
