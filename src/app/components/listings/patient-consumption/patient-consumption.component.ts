import { ReportsService } from './../../../services/helpers/reports/reports.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterPatient, OrtoReport } from '../../../bean/models/listings';
import { ListingsComponentsInterface } from '../listings.component';
import { SecureBasicItem } from '../../../bean/simple.types';
import { excelRow, exportDataToExcel } from '../../../utils/export';
import { adjustNumericValue } from '../../../utils/utils';
import { ProfesionalService } from '../../../services/helpers/profesional/profesional.service';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { NoResultsComponent } from '../../shared/no-results/no-results.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sacyl-patient-consumption',
  standalone: true,
  imports:[
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      TableModule,
      DropdownModule,
      ButtonModule,
      CalendarModule,
      TranslateModule,
      NoResultsComponent,
      InputTextModule
    ],
  templateUrl: './patient-consumption.component.html',
  styleUrls: ['./patient-consumption.component.css']
})
export class PatientConsumptionComponent implements ListingsComponentsInterface {

  @Output() back: EventEmitter<void> = new EventEmitter();

  loading = false;
  noResults = true;
  filter: FilterPatient;
  patientForm: FormGroup;
  reportList: OrtoReport[] = [];
  startDate: Date = new Date();
  endDate: Date = new Date();
  stateOptions: SecureBasicItem[] = [
    { description: 'Pendiente de facturar', code: 'pending' },
    { description: 'Facturado', code: 'invoiced' }
  ];

  constructor(
    private reportsService: ReportsService,
    private profesionalService: ProfesionalService,
    private fb: FormBuilder
  ) {
    this.filter = {
      startDate: new Date(),
      endDate: new Date(),
      province: this.provinces.at(0)!,
      state: this.stateOptions.at(0)!,
      patient: ''
    };

    this.patientForm = this.fb.group({
      startDate: [this.filter.startDate, Validators.required],
      endDate: [this.filter.endDate, Validators.required],
      province: [this.filter.province, Validators.required],
      state: [this.filter.state, Validators.required],
      patient: [this.filter.patient, Validators.required]
    });
  }

  get provinces() {
    return this.profesionalService.profesional.provinces;
  }

  goBack() {
    this.back.emit();
  }

  filterUpdate() {

    if (this.patientForm.invalid) {
      console.error('Algunos campos no están llenos');
      return;
    }

    this.loading = true;
    this.filter = this.patientForm.value;

    this.reportsService.getPatientConsumption(this.filter).subscribe(data => {
      if (data.length === 0) {
        this.noResults = true;
        this.reportList = [];
      } else {
        this.noResults = false;
        this.reportList = data.map(item => ({
          ...item,
          numeroProductos: adjustNumericValue(item.numeroProductos),
          importe: adjustNumericValue(item.importe),
          aportacion: adjustNumericValue(item.aportacion),
          gastoFinal: adjustNumericValue(item.gastoFinal)
        }));
      }
      this.loading = false;
    });
  }

  exportToExcel() {
    const columns: excelRow[] = [
      { header: 'Código', key: 'codigo', width: 10 },
      { header: 'Descripción', key: 'descripcion', width: 30 },
      { header: 'RG', key: 'rg', width: 10 },
      { header: 'Cantidad de Productos', key: 'numeroProductos', width: 15 },
      { header: 'Importe', key: 'importe', width: 15 },
      { header: 'Aportación', key: 'aportacion', width: 15 },
      { header: 'Gasto Final', key: 'gastoFinal', width: 15 }
    ];

    exportDataToExcel(this.reportList, columns, 'consumoPaciente.xlsx');

  }

}
