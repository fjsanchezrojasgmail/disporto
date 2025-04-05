import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Prescription, PrescriptionVersioned } from '../../../../bean/models/prescription';
import { PrescriptionInfoComponent } from '../../shared/prescription-info/prescription-info.component';

@Component({
  selector: 'sacyl-prescription-lateral-details',
  standalone: true,
  imports: [PrescriptionInfoComponent],
  templateUrl: './prescription-lateral-details.component.html',
  styleUrls: ['./prescription-lateral-details.component.css']
})
export class PrescriptionLateralDetailsComponent {

  @Input() prescription!: Prescription;

  @Input() history!: PrescriptionVersioned[];

  @Output() versionChange : EventEmitter<string> = new EventEmitter();

}
