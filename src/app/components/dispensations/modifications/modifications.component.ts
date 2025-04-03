import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PrescriptionActions, PrescriptionState } from '../../../bean/constants';
import { SimplePatient } from '../../../bean/models/patient';
import { Prescription, PrescriptionRow } from '../../../bean/models/prescription';
import { ModificationsService } from '../../../services/dedicated/prescription/modifications.service';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'sacyl-modifications',
  standalone: true,
  imports: [],
  templateUrl: './modifications.component.html',
  styleUrls: ['../modifications/modifications.component.css', '../dispensable-products/dispensable-products.component.css']
})
export class ModificationsComponent {

  @Input() patient!: SimplePatient;

  @Output() prescriptionDetails: EventEmitter<Prescription> = new EventEmitter();

  @ViewChild(ConfirmModalComponent) modifyModal!: ConfirmModalComponent;

  prescriptions$: Observable<PrescriptionRow[]>;
  expandedRowKeys: Record<string, boolean> = {};

  dispensables: PrescriptionRow[] = [];
  reserves: PrescriptionRow[] = [];
  blocks: PrescriptionRow[] = [];

  modify = PrescriptionActions.MODIFY;

  constructor(private modificationService: ModificationsService) {
    this.prescriptions$ = this.modificationService.prescriptions$;
    this.prescriptions$.subscribe(data => {
      this.filterPrescriptions(data);
    });
  }

  ngOnInit() {
    this.modificationService.fetchModificableProducts(this.patient);
  }

  filterPrescriptions(prescriptions: PrescriptionRow[]) {
    prescriptions.forEach(p => this.expandedRowKeys[p.id] = p.expanded);
    this.dispensables = prescriptions.filter(
      p => {
        return ([
          PrescriptionState.PRESC_DISPENSADA,
          PrescriptionState.PRESC_PDTE_VALIDACION,
          PrescriptionState.PRESC_PDTE_NUEVAVALIDACION].includes(p.status.code as PrescriptionState));
      }
    );
    this.reserves = prescriptions.filter(p => {
      return p.status.code === PrescriptionState.PRESC_RESERVADA;
    });
    this.blocks = prescriptions.filter(p => {
      return p.status.code === PrescriptionState.PRESC_BLOQUEO_CAUTELAR;
    });
  }

  showProducts($event: Event & { data: PrescriptionRow }) {
    this.modificationService.expandProducts($event.data.id);
  }

  menuAction(action: PrescriptionActions, prescription?: Prescription) {
    switch (action) {
      case PrescriptionActions.COMMUNICATE:
        break;
      case PrescriptionActions.DETAILS:
        this.prescriptionDetails.emit(prescription);
        break;
    }
  }

  revert() {
    this.modificationService.undoPrescriptions(this.patient);
  }

  modifiableDispensableRow(pres: Prescription) {
    //TODO Quitar Atna de aqui, esto solo es una consulta
    //***********creamos auditoria de modificacion de dispensacion */
    /* this.createRegAtna(pres,
      AtnaRegistrationConstants.SUBTYPE_CODE_DISPENSATION_MODIFY,
      AtnaRegistrationConstants.SUBTYPE_DISPLAY_DISPENSATION_MODIFY); */

    return this.modificationService.modifiableDispensableRow(pres);
  }

  modifiableReserveRow(pres: Prescription) {
    //TODO Quitar Atna de aqui, esto solo es una consulta
    //***********creamos auditoria de modificacion de dispensacion */
    /* this.createRegAtna(pres,
      AtnaRegistrationConstants.SUBTYPE_CODE_RESERVE_MODIFY,
      AtnaRegistrationConstants.SUBTYPE_DISPLAY_RESERVE_MODIFY); */
    return this.modificationService.modifiableReserveRow(pres);
  }

  modifiableBlockRow(pres: Prescription) {
    return this.modificationService.modifiableBlockRow(pres);
  }

}
