import { Component, EventEmitter, Type, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BudgetMonitoringComponent } from './budget-monitoring/budget-monitoring.component';
import { BudgetMonitoring2Component } from './budget-monitoring2/budget-monitoring2.component';
import { ConsumptionItemsComponent } from './consumption-items/consumption-items.component';
import { ConsumptionEstablishmentComponent } from './consumption-establishment/consumption-establishment.component';
import { EstablishmentPrescriberComponent } from './establishment-prescriber/establishment-prescriber.component';
import { PrescriberEstablishmentComponent } from './prescriber-establishment/prescriber-establishment.component';
import { PatientConsumptionComponent } from './patient-consumption/patient-consumption.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReportsService } from '../../services/helpers/reports/reports.service';

type ListedComponents =
  BudgetMonitoringComponent | BudgetMonitoring2Component | ConsumptionItemsComponent
  | ConsumptionEstablishmentComponent | PrescriberEstablishmentComponent
  | EstablishmentPrescriberComponent | PatientConsumptionComponent;

export interface ListingsComponentsInterface {
  back: EventEmitter<void>;
}

enum Options {
  BUDGET_MONITORING = 'BUDGET_MONITORING',
  BUDGET_MONITORING2 = 'BUDGET_MONITORING2',
  CONSUMPTION_ITEMS = 'CONSUMPTION_ITEMS',
  CONSUMPTION_ESTABLISHMENT = 'CONSUMPTION_ESTABLISHMENT',
  ESTABLISHMENT_PRESCRIBER = 'ESTABLISHMENT_PRESCRIBER',
  PRESCRIBER_ESTABLISHMENT = 'PRESCRIBING_ESTABLISHMENT',
  PATIENT_CONSUMPTION = 'PATIENT_CONSUMPTION',
}

const Components: { [key in Options]: Type<ListedComponents> } = {
  [Options.BUDGET_MONITORING]: BudgetMonitoringComponent,
  [Options.BUDGET_MONITORING2]: BudgetMonitoring2Component,
  [Options.CONSUMPTION_ITEMS]: ConsumptionItemsComponent,
  [Options.CONSUMPTION_ESTABLISHMENT]: ConsumptionEstablishmentComponent,
  [Options.ESTABLISHMENT_PRESCRIBER]: EstablishmentPrescriberComponent,
  [Options.PRESCRIBER_ESTABLISHMENT]: PrescriberEstablishmentComponent,
  [Options.PATIENT_CONSUMPTION]: PatientConsumptionComponent
};

@Component({
  selector: 'sacyl-listed',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css'],
  providers: [ReportsService]
})
export class ListedComponent {

  @ViewChild('container', { read: ViewContainerRef }) containerRef!: ViewContainerRef;

  listOptions: MenuItem[];

  currentView?: string;
  private currentComponentRef?: ComponentRef<ListedComponents>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    this.listOptions = [
      { label: 'listed.label.budged_monitoring', title: 'listed.description.budged_monitoring', id: Options.BUDGET_MONITORING },
      { label: 'listed.label.budged_monitoring2', title: 'listed.description.budged_monitoring2', id: Options.BUDGET_MONITORING2 },
      { label: 'listed.label.consumption_items', title: 'listed.description.consumption_items', id: Options.CONSUMPTION_ITEMS },
      {
        label: 'listed.label.consumption_establishment',
        title: 'listed.description.consumption_establishment', id: Options.CONSUMPTION_ESTABLISHMENT
      },
      { label: 'listed.label.establishment_prescriber', title: 'listed.description.establishment_prescriber', id: Options.PRESCRIBER_ESTABLISHMENT },
      {
        label: 'listed.label.prescribing_establishment',
        title: 'listed.description.prescribing_establishment', id: Options.ESTABLISHMENT_PRESCRIBER
      },
      { label: 'listed.label.patient_consumption', title: 'listed.description.patient_consumption', id: Options.PATIENT_CONSUMPTION }

    ];
  }

  changeComponent(id: string) {
    this.destroyComponent();
    this.currentView = id;
    if (this.containerRef && id && Components[id as Options]) {
      const ClassComponent = Components[id as Options];
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ClassComponent);
      this.currentComponentRef = this.containerRef.createComponent(componentFactory);
      //Evento para volver al panel de listados principal
      if ('back' in this.currentComponentRef.instance) {
        (this.currentComponentRef.instance as ListingsComponentsInterface).back.subscribe(() => {
          this.goBack();
        });
      }
    }
  }

  goBack() {
    this.destroyComponent();
    this.currentView = undefined;
  }

  private destroyComponent() {
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
    }
  }
}
