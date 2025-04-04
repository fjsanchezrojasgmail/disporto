import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'sacyl-application-row-selector',
  standalone: true,
  imports: [SelectButton,FormsModule],
  templateUrl: './application-row-selector.component.html',
  styleUrls: ['./application-row-selector.component.css']
})
export class ApplicationRowSelectorComponent {

  @Input() consider = false;

  @Input() disabled = false;

  @Output() readonly valueChange: EventEmitter<boolean> = new EventEmitter();

  selectButon: { label: string, value: boolean }[] = [];

  constructor() {
    this.selectButon = [
      { label: 'SI', value: true },
      { label: 'NO', value: false }
    ];
  }
}
