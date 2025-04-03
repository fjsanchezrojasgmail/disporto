import { Injectable } from '@angular/core';

import { HnRole, LoginData, TokenInfo as KeycloackInfo } from '../bean/credentials';

import { isBlank } from '../utils/utils';
import { from } from 'rxjs';
import { PermissionValues } from './helpers/permissions/permissions.service';
import { KeycloakService } from './keycloak.service';
import { ConfigProperties, initialConfigProperties } from '../bean/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  properties: ConfigProperties;

  keycloackInfo?: KeycloackInfo;

  constructor(private keycloakService: KeycloakService) {
    this.properties = initialConfigProperties;
  }

  setConfig(config: ConfigProperties) {
    this.properties = { ...this.properties, ...config };
  }

  setTokenInfo() {
    this.keycloackInfo = {
      scope: this.keycloakService.getTokenResponse('scope') as string,
      hnrole: this.keycloakService.getTokenResponse('hnrole') as HnRole,
      datos_login: this.keycloakService.getTokenResponse('datos_login') as LoginData
    };
    // eslint-disable-next-line max-len
    //this.keycloackInfo.scope = Object.values(PermissionValues).join(' '); //'HNDISPORTO_DISPENSATION HNDISPORTO_LISTING_CENTER HNDISPORTO_ACCESS_LISTINGS HNDISPORTO_OPEN_INVOICING HNDISPORTO_HISTORICAL_INVOICING';

    const conditition = true;
    if (conditition) {
      this.keycloackInfo.hnrole = {
        code: 'creeme que hay rol',
        display: 'pues este rol',
        permisoFact: '',
        scope: '',
        tipoRol: '',
        titular: ''
      };
      this.keycloackInfo.datos_login.dni = '99999018D'; // '99999972C';  //'99999999R'; // '99999018D';
      // eslint-disable-next-line max-len
      this.keycloackInfo.scope = Object.values(PermissionValues).join('HNDISPORTO_DISPENSATION HNDISPORTO_LISTING_CENTER HNDISPORTO_ACCESS_LISTINGS HNDISPORTO_OPEN_INVOICING HNDISPORTO_HISTORICAL_INVOICING'); //'HNDISPORTO_DISPENSATION HNDISPORTO_LISTING_CENTER HNDISPORTO_ACCESS_LISTINGS HNDISPORTO_OPEN_INVOICING HNDISPORTO_HISTORICAL_INVOICING';
      // borrar lo de arriba ------------------------------------- */
    }

    return !isBlank(this.keycloackInfo.hnrole.code);
  }

  // Gets for better naming
  get encodeUrlParams() {
    return this.properties.urlEncrytion;
  }

  get host() {
    return this.properties.hostUrl;
  }
  get hostHnanexo() {
    return this.properties.hostUrlHnanexo;
  }

  get localHost() {
    return this.properties.hostUrlLocal;
  }

  get encryptKey() {
    return this.properties.encrytionKey;
  }

  get keycloackToken() {
    return from(this.keycloakService.getToken());
  }

  get keycloackExToken() {
    return this.keycloakService.getAuth()['extToken'] as string || undefined;
  }

  get scope() {
    return this.keycloackInfo?.scope || '';
  }

}
