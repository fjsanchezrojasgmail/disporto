import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { SearchPatientFilter } from '../../../bean/models/patient';
import { PatientService } from '../../../services/helpers/patient/patient.service';
import { mapSanitaryCardToCipaByPosition } from '../../../utils/utils';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'sacyl-patient-identification',
  standalone: true,
  imports: [CommonModule,TranslateModule,ButtonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './patient-identification.component.html',
  styleUrls: ['./patient-identification.component.css']
})
export class PatientIdentificationComponent implements AfterViewInit {
  @ViewChild('identificationInput') input!: ElementRef;

  ident?: string;

  formatErrors?: boolean = false;

  focused?: boolean = true;

  loading = false;

  //solo para testeo
  selector = false;

  constructor(
    private patientService: PatientService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.input.nativeElement.focus();
  }

  identification() {
    if (this.ident && this.ident.length > 0) {
      this.loading = true;
      const filter = this.mapIdentification(this.ident);
      if (filter) {
        this.patientService
          .getPatient(filter)
          .subscribe(() => (this.loading = false));
        this.formatErrors = false;
      } else {
        this.formatErrors = true;
        this.loading = false;
      }
    }
  }

  mapIdentification(id: string): SearchPatientFilter | undefined {
    if (id.length === 14) return { barcode: id };
    if (mapSanitaryCardToCipaByPosition(id))
      return { cipa: mapSanitaryCardToCipaByPosition(id) };
    return undefined;
  }

  clear() {
    this.formatErrors = false;
    this.ident = undefined;
    this.input.nativeElement.focus();
    this.cdRef.detectChanges();
  }
}
