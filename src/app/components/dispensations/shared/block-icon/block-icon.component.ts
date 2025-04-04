import { CommonModule, formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrescriptionState } from '../../../../bean/constants';
import { PrescriptionAction } from '../../../../bean/models/prescription';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'sacyl-block-icon',
  standalone: true,
  imports: [CommonModule,Tooltip],
  templateUrl: './block-icon.component.html',
  styleUrls: ['./block-icon.component.css']
})
export class BlockIconComponent implements OnInit {

  @Input() actions?: PrescriptionAction[];

  blocksActions?: PrescriptionAction[];


  blockedStatus = '';
  rejectedStatus = '';
  acceptedStatus = '';

  constructor(private translate: TranslateService) {
    this.translate.get('tooltip.block.blocked').subscribe(data => this.blockedStatus = data);
    this.translate.get('tooltip.block.rejected').subscribe(data => this.rejectedStatus = data);
    this.translate.get('tooltip.block.accepted').subscribe(data => this.acceptedStatus = data);
  }

  ngOnInit() {
    this.blocksActions = this.actions?.filter(a => [
      PrescriptionState.BLOQUEO_CAUTELAR_ADMITIDO,
      PrescriptionState.PRESC_BLOQUEO_CAUTELAR,
      PrescriptionState.BLOQUEO_CAUTELAR_NO_ADMITIDO
    ].includes(a.state.code as PrescriptionState));
  }

  get iconColor() {
    const item = (this.blocksActions) ? this.blocksActions[0].state.code : '';
    switch (item) {
      case PrescriptionState.PRESC_BLOQUEO_CAUTELAR:
        return 'color-blocked';
      case PrescriptionState.BLOQUEO_CAUTELAR_NO_ADMITIDO:
        return 'color-rejected';
      case PrescriptionState.BLOQUEO_CAUTELAR_ADMITIDO:
        return 'color-accepted';
      default:
        return undefined;
    }
  }

  get iconTooltip() {
    let tooltip = '';
    tooltip = '<div class="flex flex-column">';
    this.blocksActions?.forEach(b => tooltip += this.generateTooltipRow(b));
    tooltip += '</div>';

    return tooltip;
  }

  private generateTooltipRow(action: PrescriptionAction) {
    const title = this.getBlockTitle(action.state.code || '');
    return `<div class="flex flex-column mb-1">
              <div class="flex">
                <span> ${formatDate(action.date, 'dd/MM/yyyy hh:mm', 'es') || '..'} - </span>
                <span class="font-semibold">${title}</span>
              </div>
              ${this.spanText(action.block?.motive.display)}
              ${this.spanText(action.block?.observation)}
            </div>`;
  }

  private getBlockTitle(block: string) {
    switch (block) {
      case PrescriptionState.PRESC_BLOQUEO_CAUTELAR://CautelarBlockCodes.PENDING:
        return this.blockedStatus;
      case PrescriptionState.BLOQUEO_CAUTELAR_NO_ADMITIDO:
        return this.rejectedStatus;
      case PrescriptionState.BLOQUEO_CAUTELAR_ADMITIDO:
        return this.acceptedStatus;
      default:
        return this.blockedStatus;//undefined;
    }
  }

  private spanText(text?: string) {
    return (text) ? `<span>${text}</span>` : '';
  }
}
