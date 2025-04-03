import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Establishment } from '../../bean/models/administration';
import { ProfesionalAdm } from '../../bean/models/profesional';
import { ConstantsService } from '../../services/constants.service';
import { ProfesionalService } from '../../services/helpers/profesional/profesional.service';
import { ConfirmModalComponent } from '../dispensations/shared/confirm-modal/confirm-modal.component';
import { ProfesionalTypes } from '../../bean/constants';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';



@Component({
  selector: 'sacyl-profesional-header',
  standalone: true,
  imports: [ConfirmModalComponent, ImageModule,CommonModule,TranslateModule],
  templateUrl: './profesional-header.component.html',
  styleUrls: ['./profesional-header.component.css']
})
export class ProfesionalHeaderComponent implements OnInit {

  prof: ProfesionalAdm = {
    "code": "prof001",
    "name": "profesional1",
    "surname1": "surname11",
    "surname2": "surname21",
    "dni": "11111111A",
    "phone": "111111111",
    "state": true,
    "dateTo": "",
    "typeProfesional": "DISPENSER_ESTABLISHMENT",
    "titular": "S",
    "permissionFac": "S",
    "listEstablecimientos": [
      {
      "code": "Estab001",
      "cif": "11111111A",
      "typeStablishment": "Establishment1",
      "typeProduct" : "Product1",
      "centerName": "centerName1",
      "codeRegion": "01",
      "descriptionRegion": "Ávila",
      "phone": "111111111",
      "address": "address1",
      "codeFact": "111111111",
      "dateTo": ""
    },
  ],
    "provinces": [
    {
      "code": "01",
      "description": "Ávila"
    },
    {
      "code": "02",
      "description": "Burgos"
    },
    {
      "code": "03",
      "description": "León"
    },
    {
      "code": "04",
      "description": "Palencia"
    },
    {
      "code": "05",
      "description": "Salamanca"
    },
    {
      "code": "06",
      "description": "Segovia"
    },
    {
      "code": "07",
      "description": "Soria"
    },
    {
      "code": "08",
      "description": "Valladolid"
    },
    {
      "code": "09",
      "description": "Zamora"
    }
  ]
    }

  @ViewChild(ConfirmModalComponent) confirmLogout!: ConfirmModalComponent;

  profesional$: Observable<ProfesionalAdm | null> | undefined;
  center$: Observable<Establishment | null> | undefined;

  establishmentType = ProfesionalTypes.DISPENSER_ESTABLISHMENT;

  constructor(private profesionalService: ProfesionalService, private constants: ConstantsService) {
    this.profesional$ = this.profesionalService.profesional$;
    this.center$ = this.profesionalService.center$;
  }
  ngOnInit(): void {
    this.profesional$ = of(this.prof);
    this.center$ = of(this.prof.listEstablecimientos[0]);
  }




  showLogOff() {
    this.confirmLogout.show();
  }

  showDocumentation() {
    this.profesional$!.subscribe(profesional => {
      if (profesional?.typeProfesional === ProfesionalTypes.DISPENSER_ESTABLISHMENT) {
        window.open('./assets/docs/PARECYL_MU_Dispensación.pdf', 'Manual Dispensación');
      } else {
        window.open('./assets/docs/PARECYL_MU_Facturacion.pdf', 'Manual Facturación');
      }
    });
  }

  logOff() {
    this.profesionalService.quitProfesional();
  }

  get profesionalTypeDescription() {
    //return this.constants.profesionalTypes.find(t => t.code === this.profesionalService.profesional.typeProfesional)?.description || '';
    return this.prof.typeProfesional;
  }

  get firstProfesionalProvince() {
    //return this.profesionalService.profesional.provinces.at(0)?.description || '';
    return this.prof.provinces[0];
  }




}
