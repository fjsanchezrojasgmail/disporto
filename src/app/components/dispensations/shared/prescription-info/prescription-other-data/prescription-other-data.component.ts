
import { faHospital } from '@fortawesome/fontawesome-free/faHospital';
import { faCalendarCheck } from '@fortawesome/fontawesome-free/faCalendarCheck';
import { Card } from 'primeng/card';
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Prescription } from '../../../../../bean/models/prescription';
import { RevisionIconComponent } from '../../revision-icon/revision-icon.component';
import { ApprovalIconComponent } from '../../approval-icon/approval-icon.component';
import { PrescriptionLabeledElementComponent } from '../prescription-labeled-element/prescription-labeled-element.component';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { BlockIconComponent } from '../../block-icon/block-icon.component';

@Component({
  selector: 'sacyl-prescription-other-data',
  standalone: true,
  imports: [CommonModule,Card,RevisionIconComponent,ApprovalIconComponent,PrescriptionLabeledElementComponent,Tooltip,BlockIconComponent],
  templateUrl: './prescription-other-data.component.html',
  styleUrls: ['./prescription-other-data.component.css']
})
export class PrescriptionOtherDataComponent {

  calendarIcon = faCalendarCheck;
  hospitalIcon = faHospital;

  @Input() prescription!: Prescription;

  tooltip = '';

  constructor(private translate: TranslateService) {
    this.translate.get('tooltip.aportation').subscribe( data => this.tooltip = data);
  }
}
