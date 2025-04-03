import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Prescription } from '../../../../bean/models/prescription';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'sacyl-confirm-modal',
  standalone: true,
  imports: [DialogModule,ButtonModule, TranslateModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {

  @Input() title!: string;
  @Input() context!: string;

  @Output() confirm: EventEmitter<Prescription | undefined> = new EventEmitter<Prescription | undefined>();

  display = false;

  object?: Prescription;

  show(object?: Prescription) {
    this.display = true;
    this.object = object;
  }

  confirmation() {
    this.confirm.emit(this.object);
    this.display = false;
  }
}
