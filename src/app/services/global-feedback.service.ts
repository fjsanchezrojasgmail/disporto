import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Message } from 'primeng/message';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalFeedbackService {

  errorTitle = 'Error!';
  warningTitle = 'Warning!';

  constructor(private translate: TranslateService, private messageService: MessageService, private config: ConfigService) {
    this.translate.get('error.title').subscribe(text => this.errorTitle = text);
    this.translate.get('warning.title').subscribe(text => this.warningTitle = text);
  }

  showErrorMessage(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: this.errorTitle,
      detail: message,
      life: this.config.properties.messageLife,
      closable: true
    });
  }

  showTranslatedErrorMessage(jsonId: string) {
    this.translate.get(jsonId).subscribe(text => {
      this.showErrorMessage(text);
    });
  }

  showWarningMessage(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: this.warningTitle,
      detail: message,
      life: this.config.properties.messageLife,
      closable: true
    });
  }

  showTranslatedWarningMessage(jsonId: string) {
    this.translate.get(jsonId).subscribe(text => {
      this.showWarningMessage(text);
    });
  }

  showSuccessMessage(message: string) {
    this.messageService.add({
      severity: 'success',
      detail: message,
      life: this.config.properties.messageLife,
      closable: true
    });
  }

  showCustomMessage(message: Partial<Message>) {
    this.messageService.add({
      text: message.text,
      severity: message.severity || 'info',
      life: message.life || this.config.properties.messageLife,
      closable: true
    });
  }
}
