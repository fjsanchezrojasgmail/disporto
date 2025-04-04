

import { Component, Input } from '@angular/core';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons/faUserCheck';
import { faUserClock } from '@fortawesome/free-solid-svg-icons/faUserClock';
import { faUserXmark } from '@fortawesome/free-solid-svg-icons/faUserXmark';
import { TranslateService } from '@ngx-translate/core';
import { RevisionCodes } from '../../../../bean/constants';
import { RevisionRequired } from '../../../../bean/models/prescription';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'sacyl-revision-icon',
  standalone: true,
  imports: [CommonModule,Tooltip,FontAwesomeModule],
  templateUrl: './revision-icon.component.html',
  styleUrls: ['./revision-icon.component.css']
})
export class RevisionIconComponent {

  @Input() revision?: RevisionRequired;

  base = '';
  approvalStatus = '';
  pendingStatus = '';
  pendingNewRevisionStatus = '';
  deniedStatus = '';

  constructor(private translate: TranslateService) {
    this.translate.get('tooltip.revision.base').subscribe(data => this.base = data);
    this.translate.get('tooltip.revision.approval').subscribe(data => this.approvalStatus = data);
    this.translate.get('tooltip.revision.pending').subscribe(data => this.pendingStatus = data);
    this.translate.get('tooltip.revision.pendingNew').subscribe(data => this.pendingNewRevisionStatus = data);
    this.translate.get('tooltip.revision.denied').subscribe(data => this.deniedStatus = data);
  }

  get icon() {
    switch (this.revision?.code) {
      case RevisionCodes.DENIED:
        return faUserXmark;
      case RevisionCodes.APPROVED:
        return faUserCheck;
      case RevisionCodes.PENDING:
        return faUserClock;
      case RevisionCodes.PENDING_NEW_REVISION:
        return faUserClock;
      default:
        return faUserXmark;
    }
  }

  get iconColor() {
    switch (this.revision?.code) {
      case RevisionCodes.DENIED:
        return 'color-denied';
      case RevisionCodes.APPROVED:
        return 'color-approval';
      case RevisionCodes.PENDING:
        return 'color-pending';
      case RevisionCodes.PENDING_NEW_REVISION:
        return 'color-pending';
      default:
        return undefined;
    }
  }

  get tooltipText() {
    let tootltip = this.base + ': ';
    if (this.revision?.display) {
      tootltip += this.revision.display;
      if (this.revision?.motive) tootltip += ` (${this.revision.motive})`;
      return tootltip;
    }
    switch (this.revision?.code) {
      case RevisionCodes.APPROVED:
        tootltip += this.approvalStatus;
        break;
      case RevisionCodes.PENDING:
        tootltip += this.pendingStatus;
        break;
      case RevisionCodes.PENDING_NEW_REVISION:
        tootltip += this.pendingNewRevisionStatus;
        break;
      case RevisionCodes.DENIED:
        tootltip += this.deniedStatus;
        break;
      default:
        '';
        break;
    }
    if (this.revision?.motive) tootltip += ` (${this.revision.motive})`;
    return tootltip;
  }
}
