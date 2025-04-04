import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BlockEvent, Justification } from '../../../../bean/simple.types';
import { FhirValue } from '../../../../bean/fhir-r3/fhir-constants';
import { Prescription } from '../../../../bean/models/prescription';
import { ConstantsService } from '../../../../services/constants.service';
import { GlobalFeedbackService } from '../../../../services/global-feedback.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DefaultTextPipe } from '../../../../pipes/default-text.pipe';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'sacyl-block-modal',
  standalone: true,
  imports: [CommonModule,ButtonModule,DialogModule,DropdownModule,FormsModule,TranslateModule,DefaultTextPipe],
  templateUrl: './block-modal.component.html',
  styleUrls: ['./block-modal.component.css']
})
export class BlockModalComponent {

  label = 'label';
  placeholder = 'placeholder';
  error = 'error';
  errorObservation = 'error';
  motives: Justification[] = [];
  motive?: Justification;
  observation?: string;
  display = false;
  prescription?: Prescription;
  fhirValues = FhirValue;

  @Output() blocked: EventEmitter<BlockEvent> = new EventEmitter();

  constructor(private translate: TranslateService,
    private feedback: GlobalFeedbackService,
    private constantsService: ConstantsService) {
    translate.get('modal.block.label.motive').subscribe(data => this.label = data);
    translate.get('modal.block.placeholder').subscribe(data => this.placeholder = data);
    translate.get('modal.block.error.motive').subscribe(data => this.error = data);
    translate.get('modal.block.error.observation').subscribe(data => this.errorObservation = data);
    this.motives = constantsService.blockMotives;
  }

  show(prescription: Prescription) {
    this.prescription = prescription;
    this.motive = undefined;
    this.observation = undefined;
    this.display = true;
  }

  block() {
    if (this.prescription && this.motive) {
      if (this.motive.remarks === FhirValue.YES && this.observation === undefined) {
        this.feedback.showErrorMessage(this.errorObservation);
      } else {
        this.blocked.emit({
          prescription: this.prescription,
          motive: { code: this.motive.code, display: this.motive.description },
          observation: this.observation
        });
        this.display = false;
      }
    } else {
      this.feedback.showErrorMessage(this.error);
    }
  }
}
