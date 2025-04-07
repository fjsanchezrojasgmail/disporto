import { Component, EventEmitter, Output } from '@angular/core';
import { GlobalFeedbackService } from '../../../services/global-feedback.service';
import { ProfesionalService } from '../../../services/helpers/profesional/profesional.service';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sacyl-confirm-dni-modal',
  standalone: true,
  imports:[DialogModule,TableModule,ButtonModule,TranslateModule,FormsModule],
  templateUrl: './confirm-dni-modal.component.html',
  styleUrls: ['./confirm-dni-modal.component.css']
})
export class ConfirmDniModalComponent {

  display = false;
  dni = '';

  @Output() generate: EventEmitter<void> = new EventEmitter();

  constructor(private profesionalService: ProfesionalService, private feedback: GlobalFeedbackService) {
  }

  show() {
    this.display = true;
  }

  confirm() {
    if (this.dni === this.profesionalService.profesional.dni) {
      this.generate.emit();
      this.display = false;
    } else this.feedback.showTranslatedWarningMessage('warning.dni.correlation');
  }
}
