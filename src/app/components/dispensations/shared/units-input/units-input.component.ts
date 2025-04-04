import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrescriptionState } from '../../../../bean/constants';
import { UnitsDefinition } from '../../../../bean/models/product';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sacyl-units-input',
  standalone: true,
  imports: [InputNumber,FormsModule],
  templateUrl: './units-input.component.html',
  styleUrls: ['./units-input.component.css']
})
export class UnitsInputComponent {

  @Input() units!: UnitsDefinition;

  @Input() state!: PrescriptionState;

  @Input() disable = false;

  @Output() readonly valueChange: EventEmitter<void> = new EventEmitter();

  change(units: number) {
    if (units > this.units.originalValue) this.units.value = this.units.originalValue;
    else if (units < 0) this.units.value = 0;
    else this.units.value = units;
    this.valueChange.emit();
  }

  get disabledInput() {
    return ![PrescriptionState.PRESC_PDTE_DISPENSAR, PrescriptionState.PRESC_RESERVADA].includes(this.state);
  }
}
