import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PatientPharmacy } from '../../../bean/constants';
import { Gender } from '../../../bean/fhir-r3/fhir-constants';
import { SimplePatient } from '../../../bean/models/patient';
import { getAge } from '../../../utils/utils';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Avatar } from 'primeng/avatar'

@Component({
  selector: 'sacyl-patient-header',
  standalone: true,
  imports: [CommonModule,TranslateModule,Avatar],
  templateUrl: './patient-header.component.html',
  styleUrls: ['./patient-header.component.css']
})
export class PatientHeaderComponent {

  @Input() patient!: SimplePatient;
  @Output() readonly onClose: EventEmitter<void> = new EventEmitter();

  close() {
    this.onClose.emit();
  }

  get icon() {
    if (!this.patient.birthDate) return 'assets/images/avatars/undefined.svg';
    const birth = new Date(this.patient.birthDate);
    const age = getAge(birth);
    if (age <= 2)
      return (this.patient.gender === Gender.MALE) ? 'assets/images/avatars/baby-boy.svg' : 'assets/images/avatars/baby-girld.svg';
    if (age <= 18)
      return (this.patient.gender === Gender.MALE) ? 'assets/images/avatars/boy.svg' : 'assets/images/avatars/girl.svg';
    if (age <= 65)
      return (this.patient.gender === Gender.MALE) ? 'assets/images/avatars/man.svg' : 'assets/images/avatars/woman.svg';

    return (this.patient.gender === Gender.MALE) ? 'assets/images/avatars/old-man.svg' : 'assets/images/avatars/old-woman.svg';
  }

  get pharmacyIndicator() { return PatientPharmacy; }

}
