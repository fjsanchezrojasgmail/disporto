import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BillingFilter } from '../../../bean/models/billing';
import { DisplayItem, PaginationState, Province } from '../../../bean/simple.types';
import { ConstantsService } from '../../../services/constants.service';

@Component({
  selector: 'sacyl-billing-filter',
  templateUrl: './billing-filter.component.html',
  styleUrls: ['./billing-filter.component.css']
})
export class BillingFilterComponent implements OnInit {

  filter?: BillingFilter;
  types: DisplayItem[] = [];
  states: DisplayItem[] = [];

  @Input() defaultFilter!: BillingFilter;

  @Input() totalRecords?: number;
  
  @Output() filterUpdate: EventEmitter<BillingFilter> = new EventEmitter();

  @Output() readonly paginarBiomedidas: EventEmitter<PaginationState> = new EventEmitter();

  constructor() {
    this.types = this.randomDisplayGenerator();
    this.states = this.randomDisplayGenerator();
  }

  ngOnInit() {
    this.filter = {...this.defaultFilter}
  }

  resetFilter() {
    this.filter = {...this.defaultFilter}
  }

  updateFilter() {
    this.filterUpdate.emit(this.filter);
  }

  randomDisplayGenerator() {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const ids = [1, 2 ,3 , 4]
    return ids.map( i => <DisplayItem>{ code: i.toString(), display: this.randomWord(letters)})
  }

  randomWord(chars: string[]): string {
    let com = '';
    for (let i = 0; i < 6; i++) {
      const index = Math.floor(Math.random() * chars.length);
      const char = chars[index];
      com += char;
    }
    return com;
  }

  onPageChange(event: PaginationState) {
    this.paginarBiomedidas.emit(event);
  }
}
