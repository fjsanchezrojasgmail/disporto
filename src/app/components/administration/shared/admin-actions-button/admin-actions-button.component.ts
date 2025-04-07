import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { AdminActions } from '../../../../bean/constants';
import { Regularisation } from '../../../../bean/models/administration';
import { Menu } from 'primeng/menu';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'sacyl-admin-actions-button',
  standalone: true,
  imports: [Menu,ButtonModule],
  templateUrl: './admin-actions-button.component.html',
  styleUrls: ['./admin-actions-button.component.css']
})
export class AdminActionsButtonComponent implements OnInit {

  @Output() readonly menuAction: EventEmitter<AdminActions> = new EventEmitter();

  items: MenuItem[];

  detailsLabel = '';
  editLabel = '';

  constructor(
    private translate: TranslateService,
    private ref: ChangeDetectorRef,
  ) {
    /*this.translate.get('menu.actions.details').subscribe(data => this.detailsLabel = data);
    this.translate.get('button.edit').subscribe(data => this.editLabel = data);*/
    forkJoin({
      edit: this.translate.get('button.edit'),
      consult: this.translate.get('button.consult'),
    }).subscribe(translations => {
     
      this.editLabel = translations.edit,
      this.detailsLabel = translations.consult
      //this.ref.detectChanges(); // solo si estás teniendo problemas de renderizado
    });


    this.items = [];
  }

  ngOnInit() {
    this.items.push({ label: this.detailsLabel, icon: 'pi pi-eye', command: () => { this.menuAction.emit(AdminActions.DETAILS) } });
    this.items.push({ label: this.editLabel, icon: 'pi pi-wrench', command: () => { this.menuAction.emit(AdminActions.MODIFY) } });

    forkJoin({
              edit: this.translate.get('button.edit'),
              consult: this.translate.get('button.consult'),
            }).subscribe(translations => {
             
              this.editLabel = translations.edit,
              this.detailsLabel = translations.consult
              //this.ref.detectChanges(); // solo si estás teniendo problemas de renderizado
            });

  }

  detailsAction() { this.menuAction.emit(AdminActions.DETAILS) }
}
