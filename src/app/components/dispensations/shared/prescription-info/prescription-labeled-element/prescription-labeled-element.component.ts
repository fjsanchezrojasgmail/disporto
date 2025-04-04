
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-free/IconProp';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'sacyl-prescription-labeled-element',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './prescription-labeled-element.component.html',
  styleUrls: ['./prescription-labeled-element.component.css']
})
export class PrescriptionLabeledElementComponent {


  @Input() primeIcon?: string;
  @Input() awsomeIcon?: IconProp;
  @Input() label!: string;
  @Input() text?: string;

}
