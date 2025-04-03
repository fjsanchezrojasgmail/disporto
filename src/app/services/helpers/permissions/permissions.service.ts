import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.service';

export enum PermissionValues {
  DISPENSATION = 'HNDISPORTO_DISPENSATION',
  OPEN_INVOICING = 'HNDISPORTO_OPEN_INVOICING',
  HISTORICAL_INVOICING = 'HNDISPORTO_HISTORICAL_INVOICING',
  ACCESS_REGULARIZATION_MANAGEMENT = 'HNDISPORTO_ACCESS_REGULARIZATION_MANAGEMENT',
  REGULARIZATION_UPDATE = 'HNDISPORTO_REGULARIZATION_UPDATE',
  ACCESS_CENTER_MANAGEMENT = 'HNDISPORTO_ACCESS_CENTER_MANAGEMENT',
  CENTER_UPDATE = 'HNDISPORTO_CENTER_UPDATE',
  ACCESS_PROFESSIONAL_MANAGEMENT = 'HNDISPORTO_ACCESS_PROFESSIONAL_MANAGEMENT',
  PROFESSIONAL_UPDATE_ESTABLISHMENTS = 'HNDISPORTO_PROFESSIONAL_UPDATE_ESTABLISHMENTS',
  PROFESSIONAL_UPDATE = 'HNDISPORTO_PROFESSIONAL_UPDATE',
  ACCESS_LISTINGS = 'HNDISPORTO_ACCESS_LISTINGS',
  ALL_LISTINGS = 'HNDISPORTO_ALL_LISTINGS',
  LISTINGS_CENTER = 'HNDISPORTO_LISTINGS_CENTER'
}

type Permission = PermissionValues;

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  scope: string[] = [];

  constructor(private configService: ConfigService) {
    const text = this.configService.scope;
    /*if (text) {
      this.scope = text.split(' ');
    }*/
    this.scope = [
      PermissionValues.DISPENSATION,
      PermissionValues.OPEN_INVOICING,
      PermissionValues.HISTORICAL_INVOICING,
      PermissionValues.ACCESS_REGULARIZATION_MANAGEMENT,
      PermissionValues.REGULARIZATION_UPDATE,
      PermissionValues.ACCESS_CENTER_MANAGEMENT,
      PermissionValues.CENTER_UPDATE,
      PermissionValues.ACCESS_PROFESSIONAL_MANAGEMENT,
      PermissionValues.PROFESSIONAL_UPDATE_ESTABLISHMENTS,
      PermissionValues.PROFESSIONAL_UPDATE,
      PermissionValues.ACCESS_LISTINGS,
      PermissionValues.ALL_LISTINGS,
      PermissionValues.LISTINGS_CENTER

    ]
  }

  can(permission: Permission) {
    return this.scope.includes(permission);
  }
}
