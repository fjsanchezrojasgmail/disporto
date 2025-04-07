import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { RegularisationBalanceCodes, RegularisationBalanceDescription, RegularisationStates } from '../../../../bean/constants';
import { Regularisation } from '../../../../bean/models/administration';
import { BillingGeneralFilter } from '../../../../bean/models/billing';
import { RegularisationDaoService } from '../../../../services/dao/regularisation-dao.service';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NoResultsComponent } from '../../../shared/no-results/no-results.component';
import { TranslateModule } from '@ngx-translate/core';

type RegularisationRow = Regularisation & { check: boolean };

@Component({
  selector: 'sacyl-billing-pending-regularisations',
  standalone: true,
  imports:[CommonModule, TableModule, CheckboxModule,TranslateModule,
    FormsModule,ReactiveFormsModule,NoResultsComponent],
  templateUrl: './billing-pending-regularisations.component.html',
  styleUrls: ['./billing-pending-regularisations.component.css']
})
export class BillingPendingRegularisationsComponent implements OnInit {

  @Input() generalFilter!: BillingGeneralFilter;
  @Output() association: EventEmitter<void> = new EventEmitter();
  loading = false;

  list: RegularisationRow[] = [];

  constructor(private regularisationDao: RegularisationDaoService) { }

  ngOnInit() {
    this.fetchPendingRegularizations();
  }

  fetchPendingRegularizations() {
    this.loading = true;
    this.list = [];
    this.regularisationDao.search({
      estadoRegularizacion: RegularisationStates.PENDING,
      codeProvincia: this.generalFilter.province?.code,
      tipoFacturacionCode: this.generalFilter.billingType?.code,
      codeCentro: this.generalFilter.code
    }).subscribe(data => {
      this.list = data.map(elem => <RegularisationRow>{ ...elem, check: false });
      this.loading = false;
    });
  }

  balanceInfo(code: RegularisationBalanceCodes) {
    return RegularisationBalanceDescription[code] || '';
  }
}
