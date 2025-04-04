
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'sacyl-prescription-labeled-element',
  standalone: true,
  imports: [CommonModule,TranslateModule,IconFieldModule,FontAwesomeModule],
  templateUrl: './prescription-labeled-element.component.html',
  styleUrls: ['./prescription-labeled-element.component.css']
})
export class PrescriptionLabeledElementComponent {


  @Input() primeIcon?: string;
  @Input() awesomeIcon?: IconProp;
  @Input() label!: string;
  @Input() text?: string;

}
