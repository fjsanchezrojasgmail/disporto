import { Component, Input } from '@angular/core';
import { Laterality } from '../../../../bean/constants';
import { LateralityDefinition } from '../../../../bean/models/product';
import { Tooltip } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { DefaultTextPipe } from '../../../../pipes/default-text.pipe';

@Component({
  selector: 'sacyl-laterality',
  standalone: true,
  imports: [Tooltip,TranslateModule,DefaultTextPipe],
  templateUrl: './laterality.component.html',
  styleUrls: ['./laterality.component.css']
})
export class LateralityComponent {

  lateralityTypes = Laterality;

  @Input() laterality?: LateralityDefinition;

  get lateralityTooltip() {
    switch(this.laterality?.bodysite) {
      case Laterality.RIGHT:
        return 'tooltip.laterality.right';
      case Laterality.LEFT:
        return 'tooltip.laterality.left';
      case Laterality.BOTH:
        return 'tooltip.laterality.both';
      default:
        return '';
    }
  }

  get showLaterality() {
    return (this.laterality && this.laterality.apply && this.laterality.apply === Laterality.APPLY);
  }
}
