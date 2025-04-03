import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SimplePatient } from '../../../bean/models/patient';
import { Prescription, PrescriptionVersioned } from '../../../bean/models/prescription';
import { PrescriptionDetailsService } from '../../../services/dedicated/prescription/prescription-details.service';

@Component({
  selector: 'sacyl-prescription-detail',
  standalone: true,
  imports: [],
  templateUrl: './prescription-detail.component.html',
  styleUrls: ['./prescription-detail.component.css']
})
export class PrescriptionDetailComponent implements OnInit {

  @Input() prescription!: Prescription;
  @Input() patient!: SimplePatient;

  @Output() close : EventEmitter<void> = new EventEmitter();

  prescriptionVersions: PrescriptionVersioned[] = [];

  lastVersion?: PrescriptionVersioned;

  prescriptionVersion?: PrescriptionVersioned;

  constructor(private detailsService: PrescriptionDetailsService) {}

  ngOnInit() {
    this.detailsService.fetchBundle(this.prescription, this.patient).subscribe( data => {
      if (data) {
        this.prescriptionVersions = data;
        this.lastVersion = this.prescriptionVersions[data.length-1];
      }
    });
  }

  closeVersion() {
    this.prescriptionVersion = undefined;
  }

  fetchVersion(version: string) {
    this.prescriptionVersion = this.prescriptionVersions.find( (p) => p.bundleVersion === version);
  }

  get version() {
    return this.prescriptionVersion !== undefined;
  }
}
