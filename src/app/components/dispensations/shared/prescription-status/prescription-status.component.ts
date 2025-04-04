import { Component, Input } from '@angular/core';
import { PrescriptionState } from '../../../../bean/constants';
import { PrescriptionStatus } from '../../../../bean/models/prescription';
import { CommonModule } from '@angular/common';
import { DefaultTextPipe } from '../../../../pipes/default-text.pipe';

@Component({
  selector: 'sacyl-prescription-status',
  standalone: true,
  imports: [CommonModule,DefaultTextPipe],
  templateUrl: './prescription-status.component.html',
  styleUrls: ['./prescription-status.component.css']
})
export class PrescriptionStatusComponent {

  @Input() status?: PrescriptionStatus;

  redTag: PrescriptionState[] = [
    PrescriptionState.PRESC_NO_SACYL
  ];
  greyTag: PrescriptionState[] = [
    PrescriptionState.PRESC_DENEGADO_VISTO_BUENO,
    PrescriptionState.PRESC_DISPENSADA,
    PrescriptionState.ANULADA_BLOQUEO_CAUTELAR,
    PrescriptionState.ANULADA,
    PrescriptionState.PRESC_NO_SACYL
  ];
  yellowTag: PrescriptionState[] = [
    PrescriptionState.PRESC_PDTE_VISTO_BUENO,
    PrescriptionState.PRESC_BLOQUEO_CAUTELAR,
    PrescriptionState.PRESC_PDTE_VALIDACION,
    PrescriptionState.PRESC_PDTE_NUEVAVALIDACION
  ];
  greenTag: PrescriptionState[] = [
    PrescriptionState.PRESC_PDTE_DISPENSAR,
    PrescriptionState.PRESC_RESERVADA
  ];
  purpleTag: PrescriptionState[] = [
    //PrescriptionState.PRESC_EN_ELABORACION,
  ];

  get tagColor() {
    if (this.redTag.find(s => s === this.status?.code)) return 'color-background-denied';
    if (this.greyTag.find(s => s === this.status?.code)) return 'color-background-rejected';
    if (this.yellowTag.find(s => s === this.status?.code)) return 'color-background-pending';
    if (this.greenTag.find(s => s === this.status?.code)) return 'color-background-approval';
    if (this.purpleTag.find(s => s === this.status?.code)) return 'color-background-draft';
    return 'color-background-rejected';
  }
}
