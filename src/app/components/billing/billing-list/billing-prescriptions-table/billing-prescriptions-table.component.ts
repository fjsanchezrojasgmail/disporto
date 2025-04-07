import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BillingStates } from '../../../../bean/constants';
import { criteriaRGBillingByCenter } from '../../../../bean/fhir-r3/criterias/request-group-criteria';
import { BundleModel } from '../../../../bean/fhir-r3/domain/bundle';
import { BillingGeneralFilter } from '../../../../bean/models/billing';
import { BillingDispensation } from '../../../../bean/models/prescription';
import { Product } from '../../../../bean/models/product';
import { RequestGroupDaoService } from '../../../../services/dao/request-group-dao.service';
import { to2DecimalsNumber } from '../../../../utils/utils';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { NoResultsComponent } from '../../../shared/no-results/no-results.component';
import { PrescriptionDescriptionComponent } from '../../../dispensations/shared/prescription-description/prescription-description.component';
import { LateralityComponent } from '../../../dispensations/shared/laterality/laterality.component';
import { ProductDescriptionComponent } from '../../../dispensations/shared/product-description/product-description.component';


@Component({
  selector: 'sacyl-billing-prescriptions-table',
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
        PrescriptionDescriptionComponent,
        ProductDescriptionComponent,
        LateralityComponent,
  
      ],
  templateUrl: './billing-prescriptions-table.component.html',
  styleUrls: ['./billing-prescriptions-table.component.css']
})
export class BillingPrescriptionsTableComponent implements OnChanges, OnInit {

  @Input() center!: string;

  @Input() selectable = false;

  @Input() billingCode?: string;

  @Input() check?: boolean;

  @Input() state!: BillingStates;

  @Input() generalFilter?: BillingGeneralFilter;

  @Output() updatedTotals: EventEmitter<void> = new EventEmitter();

  dispensations: BillingDispensation[] = [];

  expandedRowKeys: Record<string, boolean> = {};

  bundles: BundleModel[] = [];

  loading = false;

  constructor(private servie: RequestGroupDaoService) { }

  ngOnInit() {
    this.loading = true;

    const date = (this.state === BillingStates.PENDING_GENERATE && this.generalFilter) ?
      this.getLastDay(this.generalFilter.month.code, this.generalFilter.year.getFullYear()) : undefined;

    this.servie.search(criteriaRGBillingByCenter(this.center, date, this.billingCode)).subscribe(
      data => {
        if (data) {
          this.bundles.push(data);
          this.dispensations = data.mapToPrescriptionModel();
          this.dispensations.map(d => {
            this.expandedRowKeys[d.id] = d.products.length > 1;
            d.check = this.check;
          });
          this.updateTotals();
          if (data.link && data.link.length > 1) {
            const next = data.link.find(e => e.relation === 'next')?.url;
            if (next) this.recursiveNextPages(next);
          }
        }
        this.loading = false;
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['check'].currentValue !== changes['check'].previousValue
      && this.dispensations.length > 0) {
      this.dispensations = this.dispensations.map(
        d => <BillingDispensation>{ ...d, check: changes['check'].currentValue });
      this.updateTotals();
    }
  }

  recursiveNextPages(url: string) {
    this.servie.page(url).subscribe(
      data => {
        if (data) {
          this.bundles.push(data);
          const newSet = data.mapToPrescriptionModel().map(d => {
            this.expandedRowKeys[d.id] = d.products.length > 1;
            return <BillingDispensation>{ ...d, check: this.check };
          });
          this.dispensations = [...this.dispensations, ...newSet];
          this.updateTotals();
          if (data.link && data.link.length > 1) {
            const next = data.link.find(bundleLink => bundleLink.relation === 'next')?.url;
            if (next) this.recursiveNextPages(next);
          }
        }
      }
    );
  }

  calcFinalCharge(product: Product) {
    return to2DecimalsNumber((product.pvp.total || 0) - (product.userConsideration.realAportation || 0));
  }

  updateTotals() {
    this.dispensations = this.dispensations.map(d => {
      let sumAport = 0;
      let sumPvp = 0;
      let sumPvpTax = 0;
      let sumDiff = 0;
      d.products.map(p => {
        sumAport += (p.userConsideration.realAportation || 0);
        sumPvp += to2DecimalsNumber((p.pvp.value || 0) * p.units.value);
        sumPvpTax += to2DecimalsNumber((p.pvp.valueTax || 0) * p.units.value);
        sumDiff += this.calcFinalCharge(p);
      });
      return <BillingDispensation>{
        ...d,
        totalAportation: sumAport,
        totalPvp: sumPvp,
        totalPvpTax: sumPvpTax,
        totalDiff: sumDiff
      };
    });
    if (this.state === BillingStates.PENDING_GENERATE) this.updatedTotals.emit();
  }

  private getLastDay(month: number, year: number): Date {
    const date = new Date(year, month + 1, 1);
    const lastDay = new Date(date.getTime() - 1);
    lastDay.setHours(23, 59, 59);
    return lastDay;
  }

  get colspan() {
    return this.selectable ? 9 : 8;
  }



}
