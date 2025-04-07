import { Component, ViewChild } from '@angular/core';
import { BillingFilter } from '../../bean/models/billing';
import { BillingListComponent } from '../billing/billing-list/billing-list.component';

@Component({
  selector: 'sacyl-billing-history',
  standalone: true,
  imports: [BillingListComponent],
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.css']
})
export class BillingHistoryComponent {
  defaultFilter: BillingFilter = {
    state: null,
    type: null
  };

  filter?: BillingFilter;

  @ViewChild(BillingListComponent) list!: BillingListComponent;

  constructor() {
    this.filter = this.defaultFilter;
  }

  updateFilter() {
    this.list.applyFilter();
  }

}
