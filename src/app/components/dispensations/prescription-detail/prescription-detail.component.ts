import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SimplePatient } from '../../../bean/models/patient';
import { Prescription, PrescriptionVersioned } from '../../../bean/models/prescription';
import { PrescriptionDetailsService } from '../../../services/dedicated/prescription/prescription-details.service';
import { TranslateModule } from '@ngx-translate/core';
import { PrescriptionInfoComponent } from '../shared/prescription-info/prescription-info.component';
import { PrescriptionLateralDetailsComponent } from './prescription-lateral-details/prescription-lateral-details.component';
import { SidebarModule } from 'primeng/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sacyl-prescription-detail',
  standalone: true,
  imports: [CommonModule,TranslateModule,PrescriptionInfoComponent,PrescriptionLateralDetailsComponent,SidebarModule],
  templateUrl: './prescription-detail.component.html',
  styleUrls: ['./prescription-detail.component.css']
})
export class PrescriptionDetailComponent implements OnInit {

  @Input() prescription!: Prescription;
  @Input() patient!: SimplePatient;

  @Output() close : EventEmitter<void> = new EventEmitter();

  prescriptionVersions: PrescriptionVersioned[] = [];

  lastVersion?: PrescriptionVersioned;

  prescriptionVersion!: PrescriptionVersioned;


  constructor(private detailsService: PrescriptionDetailsService) {}

  ngOnInit() {
    this.detailsService.fetchBundle(this.prescription, this.patient).subscribe( data => {
      console.log("Prescription detail fetchBundle: ", this.prescription.id + "-" + this.patient.cipa);
      if (data) {
        
        this.prescriptionVersions = data;
        this.lastVersion = this.prescriptionVersions[data.length-1];
      }
    });
  }

  closeVersion() {
    this.prescriptionVersion = {
      ...this.prescriptionVersion, "id" : '', "version": 0
    };
  }

  fetchVersion(version: string) {
    this.prescriptionVersion = this.prescriptionVersions.find( (p) => p.bundleVersion === version)!;
  }

  get version() {
    return this.prescriptionVersion !== undefined;
  }
}
