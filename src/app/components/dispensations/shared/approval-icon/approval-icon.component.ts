import { Component, Input } from '@angular/core';
import { faFileCircleCheck } from '@fortawesome/fontawesome-free/faFileCircleCheck';
import { faFileCircleMinus } from '@fortawesome/fontawesome-free/faFileCircleMinus';
import { faFileCircleQuestion } from '@fortawesome/fontawesome-free/faFileCircleQuestion';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApprovalCodes } from '../../../../bean/constants';
import { ApprovalRequired, PrescriptionAction } from '../../../../bean/models/prescription';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { IconField } from 'primeng/iconfield';

@Component({
  selector: 'sacyl-approval-icon',
  standalone: true,
  imports: [CommonModule,TranslateModule,Tooltip],
  templateUrl: './approval-icon.component.html',
  styleUrls: ['./approval-icon.component.css']
})
export class ApprovalIconComponent {

  @Input() approval?: ApprovalRequired;

  @Input() actions?: PrescriptionAction[];

  base = '';
  approvalStatus = '';
  pendingStatus = '';
  deniedStatus = '';

  constructor(private translate: TranslateService) {
    this.translate.get('tooltip.approval.base').subscribe(data => this.base = data);
    this.translate.get('tooltip.approval.approval').subscribe(data => this.approvalStatus = data);
    this.translate.get('tooltip.approval.pending').subscribe(data => this.pendingStatus = data);
    this.translate.get('tooltip.approval.denied').subscribe(data => this.deniedStatus = data);
  }

  get icon() {
    switch (this.approval?.code) {
      case ApprovalCodes.DENIED:
        return faFileCircleMinus;
      case ApprovalCodes.ACCEPTED:
        return faFileCircleCheck;
      case ApprovalCodes.PENDING:
        return faFileCircleQuestion;
      default:
        return faFileCircleMinus;
    }
  }

  get iconColor() {
    switch (this.approval?.code) {
      case ApprovalCodes.DENIED:
        return 'color-denied';
      case ApprovalCodes.ACCEPTED:
        return 'color-approval';
      case ApprovalCodes.PENDING:
        return 'color-pending';
      default:
        return undefined;
    }
  }

  get tooltipText() {
    let tootltip = this.base + ': ';
    if (this.approval?.display) {
      tootltip += this.approval.display;
      if (this.approvalMotive) tootltip += ` (${this.approvalMotive})`;
      return tootltip;
    }
    switch (this.approval?.code) {
      case ApprovalCodes.ACCEPTED:
        tootltip += this.approvalStatus;
        break;
      case ApprovalCodes.PENDING:
        tootltip += this.pendingStatus;
        break;
      case ApprovalCodes.DENIED:
        tootltip += this.deniedStatus;
        break;
      default:
        break;
    }
    if (this.approvalMotive) tootltip += ` (${this.approvalMotive})`;
    return tootltip;
  }

  get approvalMotive() {
    if (this.actions && this.actions.length > 0) return this.actions.at(this.actions.length - 1)?.motive;
    return undefined;
  }
}
