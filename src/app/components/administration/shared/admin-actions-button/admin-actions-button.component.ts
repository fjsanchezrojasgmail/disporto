import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { AdminActions } from '../../../../bean/constants';
import { Regularisation } from '../../../../bean/models/administration';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'sacyl-admin-actions-button',
  standalone: true,
  imports: [Menu],
  templateUrl: './admin-actions-button.component.html',
  styleUrls: ['./admin-actions-button.component.css']
})
export class AdminActionsButtonComponent implements OnInit {

  @Output() readonly menuAction: EventEmitter<AdminActions> = new EventEmitter();

  items: MenuItem[];

  detailsLabel = '';
  editLabel = '';

  constructor(private translate: TranslateService) {
    this.translate.get('menu.actions.details').subscribe(data => this.detailsLabel = data);
    this.translate.get('button.edit').subscribe(data => this.editLabel = data);

    this.items = [];
  }

  ngOnInit() {
    this.items.push({ label: this.detailsLabel, icon: 'pi pi-eye', command: () => { this.menuAction.emit(AdminActions.DETAILS) } });
    this.items.push({ label: this.editLabel, icon: 'pi pi-wrench', command: () => { this.menuAction.emit(AdminActions.MODIFY) } });
  }

  detailsAction() { this.menuAction.emit(AdminActions.DETAILS) }
}
