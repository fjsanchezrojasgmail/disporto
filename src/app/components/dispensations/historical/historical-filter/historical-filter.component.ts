import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { prescriptionDisplay, PrescriptionState } from '../../../../bean/constants';
import { DisplayItem, HistoricFilter } from '../../../../bean/simple.types';
import { ConstantsService } from '../../../../services/constants.service';

@Component({
  selector: 'sacyl-historical-filter',
  standalone: true,
  imports: [],
  templateUrl: './historical-filter.component.html',
  styleUrls: ['./historical-filter.component.css']
})
export class HistoricalFilterComponent implements OnInit {

  filter: HistoricFilter;

  options: DisplayItem[] = [];

  @Output() filterChange: EventEmitter<HistoricFilter> = new EventEmitter();

  constructor(private constantsService: ConstantsService) {
    const endYear = new Date().getFullYear();
    const startYear = new Date().getFullYear() - this.diff;
    this.filter = {
      endYear: endYear,
      startYear: startYear,
      state: null
    };
    this.getOptions();
  }

  ngOnInit(): void {
    this.filterChange.emit(this.filter);
  }

  onChangeFilter() {
    if (this.isValid()) {
      this.filterChange.emit(this.filter);
    }
  }

  onChangeStartYear() {
    const difference = this.filter.endYear - this.filter.startYear;
    if (difference > this.maxThreshold) {
      this.filter.endYear = this.filter.startYear + this.maxThreshold;
    } else if (this.filter.startYear > this.filter.endYear) {
      this.filter.endYear = this.filter.startYear;
    }
  }

  onChangeEndYear() {
    const difference = this.filter.endYear - this.filter.startYear;
    if (difference > this.maxThreshold) {
      this.filter.startYear = this.filter.endYear - this.maxThreshold;
    } else if (this.filter.endYear < this.filter.startYear) {
      this.filter.startYear = this.filter.endYear;
    }
  }

  updateFilter() {
    this.filterChange.emit(this.filter);
  }

  private isValid() {
    return true;
  }

  private getOptions() {
    this.options = [
      PrescriptionState.PRESC_PDTE_VALIDACION,
      PrescriptionState.PRESC_PDTE_NUEVAVALIDACION,
      PrescriptionState.ANULADA,
      PrescriptionState.PRESC_PDTE_DISPENSAR,
      PrescriptionState.PRESC_PDTE_VISTO_BUENO,
      PrescriptionState.PRESC_NO_SACYL,
      PrescriptionState.PRESC_DENEGADO_VISTO_BUENO,
      PrescriptionState.PRESC_RESERVADA,
      PrescriptionState.PRESC_DISPENSADA,
      PrescriptionState.PRESC_BLOQUEO_CAUTELAR,
      PrescriptionState.ANULADA_BLOQUEO_CAUTELAR
    ].map(c => <DisplayItem>{ code: c, display: prescriptionDisplay[c] || '' });
  }

  get diff() {
    return this.constantsService.historicThreshold;
  }

  get maxThreshold() {
    return this.constantsService.historicMaxThreshold - 1;
  }

}
