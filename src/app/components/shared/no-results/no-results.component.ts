import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'sacyl-no-results',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.css']
})
export class NoResultsComponent {

  @Input() textId = 'not_found';

  @Input() icon = 'fa-regular fa-folder-open';
}
