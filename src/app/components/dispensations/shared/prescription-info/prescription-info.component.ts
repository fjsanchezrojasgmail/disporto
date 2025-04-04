import { AfterViewChecked, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Prescription, PrescriptionVersioned } from '../../../../bean/models/prescription';
import { PrescriptionVersionListComponent } from './prescription-version-list/prescription-version-list.component';
import { AccordionModule } from 'primeng/accordion'
import { PrescriptionGeneralDataComponent } from './prescription-general-data/prescription-general-data.component';
import { PrescriptionOtherDataComponent } from './prescription-other-data/prescription-other-data.component';
import { PrescriptionProductListComponent } from './prescription-product-list/prescription-product-list.component';
import { DefaultTextPipe } from '../../../../pipes/default-text.pipe';

@Component({
  selector: 'sacyl-prescription-info',
  standalone: true,
  imports: [
    PrescriptionVersionListComponent,
    AccordionModule,
    PrescriptionGeneralDataComponent,
    PrescriptionOtherDataComponent,
    PrescriptionProductListComponent,
    DefaultTextPipe
  ],
  templateUrl: './prescription-info.component.html',
  styleUrls: ['./prescription-info.component.css']
})
export class PrescriptionInfoComponent implements AfterViewChecked {

  @Input() prescription?: PrescriptionVersioned;

  @Input() history!: PrescriptionVersioned[];

  @Output() versionChange: EventEmitter<string> = new EventEmitter();

  generalHeader = '';
  otherHeader = '';
  productsHeader = '';
  observationsHeader = '';
  usesHeader = '';
  versionsHeader = '';
  transitionOptions = '0ms';

  constructor(private translate: TranslateService) {
    translate.get('details.header.general').subscribe( data => this.generalHeader = (data as string).toUpperCase());
    translate.get('details.header.other').subscribe( data => this.otherHeader = (data as string).toUpperCase());
    translate.get('details.header.products').subscribe( data => this.productsHeader = (data as string).toUpperCase());
    translate.get('details.header.observations').subscribe( data => this.observationsHeader = (data as string).toUpperCase());
    translate.get('details.header.uses').subscribe( data => this.usesHeader = (data as string).toUpperCase());
    translate.get('details.header.versions').subscribe( data => this.versionsHeader = (data as string).toUpperCase());
  }

  ngAfterViewChecked() {
      this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
  }
}
