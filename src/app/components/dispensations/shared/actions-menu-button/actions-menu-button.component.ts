import { Component, EventEmitter, Input, Output, Inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { PrescriptionRow } from '../../../../bean/models/prescription';
import { tap } from 'rxjs/operators';
import { PrescriptionActions, PrescriptionState } from '../../../../bean/constants';
import { Product } from '../../../../bean/models/product';
import { DispensingCenter } from '../../../../bean/simple.types';
import { ConstantsService } from '../../../../services/constants.service';
import { ProfesionalService } from '../../../../services/helpers/profesional/profesional.service';
import { ComunicationMessageRS } from '../../../../bean/models/comunication-message.bean';
import { ComunicationDAOService } from '../../../../services/dao/comunication-dao.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'sacyl-actions-menu-button',
  standalone: true,
  imports: [CommonModule,ButtonModule,TranslateModule,Menu],
  templateUrl: './actions-menu-button.component.html',
  styleUrls: ['./actions-menu-button.component.css']
})
export class ActionsMenuButtonComponent {

  @Input() state!: PrescriptionState;

  @Input() disabled!: boolean;

  @Input() products!: Product[];

  @Input() center?: DispensingCenter;

  @Input() prescription!: PrescriptionRow;

  @Input() patientCipa!: string | undefined;

  //para ver si existe la opcion de comunicar en el menu
  @Input() menuExistComunication!: boolean;
  //para ver si existen comunicaciones en la BBDD y se muestra el punto rojo
  @Input() menuActionIfExistComunicationInBBDD!: boolean;


  @Output() readonly menuAction: EventEmitter<PrescriptionActions> = new EventEmitter();

  items: MenuItem[];

  dispenseLabel = '';
  reserveLabel = '';
  blockLabel = '';
  communicateLabel = '';
  selectBrand = '';
  detailsLabel = '';

  constructor(
    private translate: TranslateService,
    private profesionalService: ProfesionalService,
    private constantsService: ConstantsService,
    private comunicationDAOService: ComunicationDAOService
  ) {

    this.translate.get('menu.actions.dispense').subscribe(data => this.dispenseLabel = data);
    this.translate.get('menu.actions.reserve').subscribe(data => this.reserveLabel = data);
    this.translate.get('menu.actions.block').subscribe(data => this.blockLabel = data);
    this.translate.get('menu.actions.communicate').subscribe(data => this.communicateLabel = data);
    this.translate.get('menu.actions.details').subscribe(data => this.detailsLabel = data);
    this.translate.get('menu.actions.brand').subscribe(data => this.selectBrand = data);

    this.items = [];
  }

  ngOnInit() {
    console.log("Prescripcion cargada para menu actions: ", this.prescription);
    if (this.canDetails) this.items.push({ label: this.detailsLabel, command: () => { this.menuAction.emit(PrescriptionActions.DETAILS); } });
    if (this.canReserve) this.items.push({ label: this.reserveLabel, command: () => { this.menuAction.emit(PrescriptionActions.RESERVE); } });
    if (this.canBlock) this.items.push({ label: this.blockLabel, command: () => { this.menuAction.emit(PrescriptionActions.BLOCK); } });
    if (this.canCommunicate) {
      this.menuExistComunication = true;
      this.items.push({ label: this.communicateLabel, command: () => { this.menuAction.emit(PrescriptionActions.COMMUNICATE); } });
    }

    this.checkExistsComunications(this.patientCipa, this.prescription.id || '');
    if (this.setBrand && !this.disabled) this.items.push({
      label: this.selectBrand,
      command: () => { this.menuAction.emit(PrescriptionActions.SET_BRAND); }
    });
  }

  get canDetails() {
    console.log("Estado de la prescripcion: ", this.state);
    switch (this.state) {
      case PrescriptionState.PRESC_PDTE_VALIDACION:
      case PrescriptionState.PRESC_PDTE_NUEVAVALIDACION:
      case PrescriptionState.PRESC_DISPENSADA:
      case PrescriptionState.PRESC_PDTE_DISPENSAR:
        return true;
      case PrescriptionState.PRESC_RESERVADA:
      case PrescriptionState.PRESC_BLOQUEO_CAUTELAR:
        return this.center?.code === this.profesionalService.secureEstablishment.code || this.center === undefined;
      default:
        return false;
    }
  }

  get canReserve() {
    return PrescriptionState.PRESC_PDTE_DISPENSAR === this.state;
  }

  get canBlock() {
    return [
      PrescriptionState.PRESC_PDTE_DISPENSAR
    ].includes(this.state);
  }

  get setBrand() {
    return this.constantsService.selectCommercialBrand && this.products.some(p => !p.brand || (p.brand && p.replaceable));
  }

  get canCommunicate() {
    // estas para registro
    if (PrescriptionState.PRESC_PDTE_DISPENSAR === this.state) return true;
    if (PrescriptionState.PRESC_RESERVADA === this.state) this.center?.code === this.profesionalService.secureEstablishment.code;
    // estas para consulta
    if ([PrescriptionState.PRESC_DISPENSADA,
    PrescriptionState.ANULADA_BLOQUEO_CAUTELAR,
    PrescriptionState.ANULADA].includes(this.state)) {
      return true;
    }
    return false;
  }

  /*

  Metodo que comprueba si existen comunicaciones para habilitar el punto rojo

  */

  checkExistsComunications(patientCipa: string | undefined, requestGroupId: string) {


    const existComunicationNumber = 0;
    const messageComunication = new ComunicationMessageRS();
    messageComunication.cipa = patientCipa;
    messageComunication.requestgroupID = requestGroupId;

    this.comunicationDAOService.findIfExistsComunication(
      messageComunication,
      this.comunicationDAOService.getUrl(
        this.comunicationDAOService.localUrl, this.comunicationDAOService.pathIfExists))
      .pipe(
        tap((data: number) => this.activeRedPoint(data)))
      .subscribe();




  }

  /*

  Metodo que activa o desactiva punto rojo

  */

  activeRedPoint(comunication: number) {

    if (Number(comunication) > 0) {



      //activa/desactiva que muestre punto rojo
      this.menuActionIfExistComunicationInBBDD = true;

    } else {


      //activa/desactiva que muestre punto rojo
      this.menuActionIfExistComunicationInBBDD = false;

    }

  }

}
