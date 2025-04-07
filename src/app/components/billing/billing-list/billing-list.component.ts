import { Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Establishment } from '../../../bean/models/administration';
import { EstablishmentBillingRow, BillingGeneralFilter } from '../../../bean/models/billing';
import { BillingCentersService } from '../../../services/dedicated/billing/billing-centers.service';
import { BillingPrescriptionsTableComponent } from './billing-prescriptions-table/billing-prescriptions-table.component';
import { CommonModule } from '@angular/common';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { TableModule, TableRowExpandEvent } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { NoResultsComponent } from '../../shared/no-results/no-results.component';
import { BillingEstablishmentStateComponent } from '../shared/billing-establishment-state/billing-establishment-state.component';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'sacyl-billing-list',
  standalone: true,
  imports: [
      CommonModule,
      CheckboxModule,
      TableModule,
      FormsModule,
      ReactiveFormsModule,
      TranslateModule,
      ButtonModule,
      NoResultsComponent,
      BillingPrescriptionsTableComponent,
      BillingEstablishmentStateComponent,
      TooltipModule,
    ],
  templateUrl: './billing-list.component.html',
  styleUrls: ['./billing-list.component.css'],
  providers: [BillingCentersService]
})
export class BillingListComponent implements OnChanges {

  @ViewChild(BillingPrescriptionsTableComponent) prescriptions?: BillingPrescriptionsTableComponent;

  @Input() generalFilter!: BillingGeneralFilter;

  @Output() pendingEstablishment: EventEmitter<Partial<Establishment>[]> = new EventEmitter<Partial<Establishment>[]>();

  billingEstablishments: EstablishmentBillingRow[] = [];

  expandedRowKeys: Record<string, boolean> = {};

  check = false;

  loading = false;

  constructor(private billingCentersService: BillingCentersService) {
    this.billingCentersService.billingCenters$.subscribe((data) => {
      this.billingEstablishments = data;
      data.map((d) => (this.expandedRowKeys[d.id] = d.expanded));
    });
    this.billingCentersService.loadingFetch$.subscribe((data) => this.loading = data);
    this.billingCentersService.pendingEstablishments$.subscribe((data) => this.pendingEstablishment.emit(data));
  }

  ngOnChanges() {
    this.applyFilter();
  }

  applyFilter() {
    this.billingCentersService.fetchBillingCenters(this.generalFilter);
  }

  applyGeneralFilter(generalFilter: BillingGeneralFilter) {
    this.billingCentersService.fetchBillingCenters(generalFilter);
  }

  showDispensations($event: TableRowExpandEvent & { data: EstablishmentBillingRow }) {
    this.billingCentersService.showDispensations($event.data.id);
  }

  generalCheck($event: CheckboxChangeEvent ) {
    this.billingEstablishments.map((c) => (c.check = $event.checked));
  }


  updateTotal() {
    this.billingEstablishments.map((bill) => {
      if (bill.expanded && this.prescriptions) {
        const checkedDispensations = this.prescriptions.dispensations.filter(disp => disp.check);
        this.billingCentersService.updateTotals(bill, checkedDispensations);
        if (checkedDispensations.length === 0 && bill.check) {
          bill.check = false;
        }
      }
    });
  }

  get selectableList() {
    return this.billingEstablishments.some(e => e.selectable);
  }

  get currentDispensations() {
    return this.prescriptions?.dispensations || [];
  }
  get currentBundles() {
    return this.prescriptions?.bundles;
  }
}
