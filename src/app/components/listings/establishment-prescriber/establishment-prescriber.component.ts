import { ReportsService } from './../../../services/helpers/reports/reports.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FilterDispensingCenter, OrtoReport } from '../../../bean/models/listings';
import { ListingsComponentsInterface } from '../listings.component';
import { SecureBasicItem } from '../../../bean/simple.types';
import { excelRow, exportDataToExcel } from '../../../utils/export';
import { adjustNumericValue } from '../../../utils/utils';
import { Establishment } from '../../../bean/models/administration';
import { EstablishmentDaoService } from '../../../services/dao/establishment-dao.service';
import { ProfesionalService } from '../../../services/helpers/profesional/profesional.service';
import { CalendarModule } from 'primeng/calendar';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { NoResultsComponent } from '../../shared/no-results/no-results.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'sacyl-establishment-prescriber',
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
  templateUrl: './establishment-prescriber.component.html',
  styleUrls: ['./establishment-prescriber.component.css']
})
export class EstablishmentPrescriberComponent implements ListingsComponentsInterface {

  @Output() back: EventEmitter<void> = new EventEmitter();

  loading = false;
  noResults = true;
  filter: FilterDispensingCenter;
  establishmentForm: FormGroup;
  reportList: OrtoReport[] = [];
  establishmentList: Establishment[] = [];
  startDate: Date = new Date();
  endDate: Date = new Date();
  stateOptions: SecureBasicItem[] = [
    { description: 'Pendiente de facturar', code: 'pending' },
    { description: 'Facturado', code: 'invoiced' }
  ];

  constructor(
    private reportsService: ReportsService,
    private profesionalService: ProfesionalService,
    private fb: FormBuilder,
    private establishmentService: EstablishmentDaoService
  ) {

    this.filter = {
      startDate: new Date(),
      endDate: new Date(),
      province: this.provinces.at(0)!,
      state: this.stateOptions.at(0)!,
      dispensingCenter: ''
    };

    this.establishmentForm = this.fb.group({
      startDate: [this.filter.startDate, Validators.required],
      endDate: [this.filter.endDate, Validators.required],
      province: [this.filter.province, Validators.required],
      state: [this.filter.state, Validators.required],
      dispensingCenter: [this.filter.dispensingCenter, Validators.required]
    });

    this.fetchEstablishments();
  }

  get provinces() {
    return this.profesionalService.profesional.provinces;
  }

  goBack() {
    this.back.emit();
  }

  filterUpdate() {

    if (this.establishmentForm.invalid) {
      console.error('Algunos campos no están llenos');
      return;
    }

    this.loading = true;
    this.filter = this.establishmentForm.value;

    this.reportsService.getConsumptionEstablishmentPrescriber(this.filter).subscribe(data => {
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

  updateDispensingCenter($event: DropdownChangeEvent & { value: Establishment }) {
    this.updateFirstEstablishment($event.value);
  }

  fetchEstablishments() {
    this.establishmentService.search({}).subscribe(data => {
      this.establishmentList = data;

      // Verifica si hay al menos un establecimiento antes de seleccionar el primero en el p-dropdown
      if (this.establishmentList.length > 0) {
        this.updateFirstEstablishment(this.establishmentList[0]);
      }
    });
  }

  private updateFirstEstablishment(est: Establishment) {
    const dispensingCenterControl = this.establishmentForm.get('dispensingCenter');
    if (dispensingCenterControl) {
      if (est) {
        dispensingCenterControl.setValue(est.cif);
      } else {
        dispensingCenterControl.setValue('');
      }
    }
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

    exportDataToExcel(this.reportList, columns, 'consumoEstablecimientoPrescriptor.xlsx');

  }

}
