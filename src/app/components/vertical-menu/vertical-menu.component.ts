import { AfterViewChecked, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { CodeMenusComponents, ProfesionalTypes } from '../../bean/constants';
import { PermissionsService, PermissionValues } from '../../services/helpers/permissions/permissions.service';
import { ProfesionalService } from '../../services/helpers/profesional/profesional.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DefaultTextPipe } from '../../pipes/default-text.pipe';
import { ProfesionalAdm } from '../../bean/models/profesional';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'sacyl-vertical-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule,DefaultTextPipe, FontAwesomeModule],
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.css']
})
export class VerticalMenuComponent implements OnInit, AfterViewChecked {

  @Output() readonly selectedOption: EventEmitter<MenuItem> = new EventEmitter();

  options: MenuItem[];
  activeOption?: MenuItem;

  singletonFirstOption = true;

  constructor(private permissionsService: PermissionsService, private profesionalService: ProfesionalService) {
    this.options = [];
  }

  ngOnInit() {
    if (this.permissionsService.can(PermissionValues.DISPENSATION)) {
      this.options.push({ id: CodeMenusComponents.DISPENSATIONS, label: 'tabmenu.disp.dispensing', icon: PrimeIcons.SAVE });
    }
    if (this.permissionsService.can(PermissionValues.OPEN_INVOICING)) {

      //const prof = this.profesionalService.profesional;

      const prof: ProfesionalAdm = {
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

      if ((prof.typeProfesional === ProfesionalTypes.DISPENSER_ESTABLISHMENT && prof.permissionFac === 'S') ||
        prof.typeProfesional !== ProfesionalTypes.DISPENSER_ESTABLISHMENT) {
        this.options.push({ id: CodeMenusComponents.BILLING, label: 'tabmenu.disp.billing', icon: PrimeIcons.MONEY_BILL });
      }
    }
    if (this.permissionsService.can(PermissionValues.HISTORICAL_INVOICING)) {
      this.options.push({ id: CodeMenusComponents.BILLING_HISTORY, label: 'tabmenu.fact.historical_turnover', icon: PrimeIcons.CLOCK });
    }
    if (this.permissionsService.can(PermissionValues.ACCESS_REGULARIZATION_MANAGEMENT)) {
      this.options.push({ id: CodeMenusComponents.ADJUSTMENT_ADMINISTRATION, label: 'tabmenu.admin.adjustment', icon: PrimeIcons.CHECK_CIRCLE });
    }
    if (this.permissionsService.can(PermissionValues.ACCESS_CENTER_MANAGEMENT)) {
      this.options.push({ id: CodeMenusComponents.ESTABLISHMENT_ADMINISTRATION, label: 'tabmenu.admin.establishment', icon: PrimeIcons.BUILDING });
    }
    if (this.permissionsService.can(PermissionValues.ACCESS_PROFESSIONAL_MANAGEMENT)) {
      this.options.push({ id: CodeMenusComponents.PROFESIONAL_ADMINISTRATION, label: 'tabmenu.admin.profesional', icon: PrimeIcons.USER });
    }
    if (this.permissionsService.can(PermissionValues.ACCESS_LISTINGS)) {
      this.options.push({ id: CodeMenusComponents.LISTED, label: 'tabmenu.admin.listed', icon: PrimeIcons.LIST });
    }
    this.activeOption = this.options.at(0);
  }

  ngAfterViewChecked() {
    if (this.singletonFirstOption) {
      this.selectedOption.emit(this.activeOption);
      this.singletonFirstOption = false;
    }
  }

  setActiveOption(option: MenuItem) {
    this.activeOption = option;
    this.selectedOption.emit(option);
  }
}
