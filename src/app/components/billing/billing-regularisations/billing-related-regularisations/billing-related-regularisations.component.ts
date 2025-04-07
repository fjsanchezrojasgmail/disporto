import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RegularisationBalanceCodes, RegularisationBalanceDescription } from '../../../../bean/constants';
import { RegularisationCodes, Regularisation } from '../../../../bean/models/administration';
import { RegularisationDaoService } from '../../../../services/dao/regularisation-dao.service';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { NoResultsComponent } from '../../../shared/no-results/no-results.component';

@Component({
  selector: 'sacyl-billing-related-regularisations',
  standalone: true,
  imports: [CommonModule,TableModule,TranslateModule,NoResultsComponent],
  templateUrl: './billing-related-regularisations.component.html',
  styleUrls: ['./billing-related-regularisations.component.css']
})
export class BillingRelatedRegularisationsComponent {

  loading = false;

  list: Regularisation[] = [];

  constructor(private regularisationDao: RegularisationDaoService) { }

  fetchRelatedRegularizations(codes: RegularisationCodes) {
    this.loading = true;
    this.list = [];
    this.regularisationDao.search({
      ...codes
    }).subscribe(data => {
      this.list = data;
      this.loading = false;
    });
  }

  balanceInfo(code: RegularisationBalanceCodes) {
    return RegularisationBalanceDescription[code] || '';
  }
}
