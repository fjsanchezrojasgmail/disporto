import { Component, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { CodeMenusComponents } from '../bean/constants';
import { ConstantsService } from '../services/constants.service';
import { LoadService } from '../services/load.service';
import { VerticalMenuComponent } from './vertical-menu/vertical-menu.component';
import { ProfesionalHeaderComponent } from './profesional-header/profesional-header.component';
import { DispensationsComponent } from './dispensations/dispensations.component';
import { BillingComponent } from './billing/billing.component';
import { BillingHistoryComponent } from './billing-history/billing-history.component';
import { ListedComponent } from './listings/listings.component';
import { CenterAdministrationComponent } from './administration/center-administration/center-administration.component';
import { ProfesionalsAdministrationComponent } from './administration/profesionals-administration/profesionals-administration.component';
import { RegularisationsAdministrationComponent } from './administration/regularisations-administration/regularisations-administration.component';



export type MenuComponents = DispensationsComponent | BillingComponent |
BillingHistoryComponent | ListedComponent | RegularisationsAdministrationComponent;

export const Components: { [key in CodeMenusComponents]: Type<MenuComponents> } = {

  [CodeMenusComponents.DISPENSATIONS]: DispensationsComponent,
  [CodeMenusComponents.BILLING]: BillingComponent,
  [CodeMenusComponents.BILLING_HISTORY]: BillingHistoryComponent,
  [CodeMenusComponents.ADJUSTMENT_ADMINISTRATION]: RegularisationsAdministrationComponent,
  [CodeMenusComponents.ESTABLISHMENT_ADMINISTRATION]: CenterAdministrationComponent,
  [CodeMenusComponents.PROFESIONAL_ADMINISTRATION]: ProfesionalsAdministrationComponent,
  [CodeMenusComponents.LISTED]: ListedComponent

}

/*export type MenuComponents =
  DispensationsComponent |
  BillingComponent |
  BillingHistoryComponent |
  RegularisationsAdministrationComponent |
  CenterAdministrationComponent |
  ListedComponent |
  ProfesionalsAdministrationComponent;

export const Components: { [key in CodeMenusComponents]: Type<MenuComponents> } = {
  [CodeMenusComponents.DISPENSATIONS]: DispensationsComponent,
  [CodeMenusComponents.BILLING]: BillingComponent,
  [CodeMenusComponents.BILLING_HISTORY]: BillingHistoryComponent,
  [CodeMenusComponents.ADJUSTMENT_ADMINISTRATION]: RegularisationsAdministrationComponent,
  [CodeMenusComponents.ESTABLISHMENT_ADMINISTRATION]: CenterAdministrationComponent,
  [CodeMenusComponents.PROFESIONAL_ADMINISTRATION]: ProfesionalsAdministrationComponent,
  [CodeMenusComponents.LISTED]: ListedComponent
};*/
@Component({
  selector: 'sacyl-main-page',
  standalone: true,
  imports: [ProfesionalHeaderComponent,VerticalMenuComponent],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  @ViewChild('container', { read: ViewContainerRef }) containerRef!: ViewContainerRef;

  counter$: Observable<number>;

  constructor(private constantsService: ConstantsService, private loadingService: LoadService) {
    this.counter$ = loadingService.calls$;
    loadingService.calls$.subscribe();
  }

  changeComponent(opt: MenuItem) {
    if (this.containerRef && opt.id && Components[opt.id as CodeMenusComponents]) {
      const ClassComponent = Components[opt.id as CodeMenusComponents];
      this.containerRef.clear();
      this.containerRef.createComponent(ClassComponent);
    }
  }
}
