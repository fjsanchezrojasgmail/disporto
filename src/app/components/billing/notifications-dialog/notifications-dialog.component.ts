import { Component, Input } from '@angular/core';
import { Establishment } from '../../../bean/models/administration';
import { DefaultTextPipe } from '../../../pipes/default-text.pipe';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'sacyl-notifications-dialog',
  standalone:true,
  imports:[DialogModule,TableModule,DefaultTextPipe,TranslateModule],
  templateUrl: './notifications-dialog.component.html',
  styleUrls: ['./notifications-dialog.component.css']
})
export class NotificationsDialogComponent {

  @Input() establishments: Partial<Establishment>[] = [];

  display = false;

  show() {
    this.display = true;
  }
}
