import { Component, Input, OnInit } from '@angular/core';
import { BillingStates, billingEstablishmentStatesDisplay } from '../../../../bean/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sacyl-billing-establishment-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing-establishment-state.component.html',
  styleUrls: ['./billing-establishment-state.component.css']
})
export class BillingEstablishmentStateComponent implements OnInit {

  @Input() stateCode!: BillingStates;

  label: string;

  constructor() {
    this.label = '';
  }

  ngOnInit() {
    this.label = billingEstablishmentStatesDisplay[this.stateCode];
  }

  get tagColor() {
    if (this.stateCode === BillingStates.PENDING_GENERATE) return 'color-background-rejected';
    if (this.stateCode === BillingStates.PENDING_ACCEPTANCE) return 'color-background-pending';
    if (this.stateCode === BillingStates.ACCEPTED) return 'color-background-approval';
    if (this.stateCode === BillingStates.CONFIRMED) return 'color-background-approval';
    if (this.stateCode === BillingStates.CLOSED) return 'color-background-denied';
    return 'color-background-rejected';
  }

}
