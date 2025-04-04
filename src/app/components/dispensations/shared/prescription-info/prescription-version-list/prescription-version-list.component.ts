import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Prescription, PrescriptionVersioned, PrescriptionStatus } from '../../../../../bean/models/prescription';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { PrescriptionStatusComponent } from '../../prescription-status/prescription-status.component';
import { CommonModule } from '@angular/common';

type VersioRow = {
  num: number;
  date?: Date;
  status?: PrescriptionStatus;
}

@Component({
  selector: 'sacyl-prescription-version-list',
  standalone: true,
  imports: [CommonModule,TableModule,TranslateModule,PrescriptionStatusComponent],
  templateUrl: './prescription-version-list.component.html',
  styleUrls: ['./prescription-version-list.component.css']
})
export class PrescriptionVersionListComponent {

  @Input() prescription!: PrescriptionVersioned;

  @Input() history!: PrescriptionVersioned[];

  @Output() versionChange : EventEmitter<string> = new EventEmitter();


}
