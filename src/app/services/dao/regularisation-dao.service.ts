import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { AdminStatus, RegularisationBalanceCodes, RegularisationClassificationCodes, RegularisationStates } from '../../bean/constants';
import { Regularisation, RegularisationAdm, RegularisationAssociation, RegularisationCodes } from '../../bean/models/administration';
import { BasicCode } from '../../bean/simple.types';
import { ConstantsService } from '../constants.service';
import { HttpService } from '../http.service';
import { RegularisationDao } from './interfaces/regularisation-dao.interface';

@Injectable({
  providedIn: 'root'
})
export class RegularisationDaoService implements RegularisationDao {

  constructor(private http: HttpService, private constants: ConstantsService) { }

  create(regularisation: Regularisation): Observable<boolean> {
    const body = this.mapRegularisationToAdm(regularisation);
    return this.http.post<RegularisationAdm, RegularisationAdm>('/api/rest/regularizacion/adm/add', body).pipe(map(value => {
      if (value) return true;
      else return false;
    }));
  }

  update(regularisation: Regularisation): Observable<boolean> {
    const body = this.mapRegularisationToAdm(regularisation);
    return this.http.post<RegularisationAdm, RegularisationAdm>('/api/rest/regularizacion/adm/update', body).pipe(map(value => {
      if (value) return true;
      else return false;
    }));
  }
  search(filter: Partial<RegularisationAdm>): Observable<Regularisation[]> {
    /*return this.http.post<RegularisationAdm[], Partial<RegularisationAdm>>('/api/rest/regularizacion/adm/search', filter).pipe(map(value => {
      if (value) return value.map(r => this.mapAdmToRegularisation(r));
      return [];
    }));*/
    return of(this.MOCK_REGULARISATIONS);
  }

  searchPending(filter: Partial<RegularisationAdm>): Observable<boolean> {
    return this.http.post<boolean, Partial<RegularisationAdm>>('/api/rest/regularizacion/existRegPend', filter).pipe(map(value => {
      if (value) return value;
      return false;
    }));
  }

  searchAssociated(filter: RegularisationCodes): Observable<boolean> {
    const body: RegularisationAssociation = {
      codFacturacionProvincial: filter.facturacionProvincialCode,
      codFacturaEstablecimiento: filter.facturacionEstablecimientoCode
    };
    return this.http.post<boolean, RegularisationAssociation>('/api/rest/regularizacion/existFactReg', body).pipe(map(value => {
      if (value) return value;
      return false;
    }));
  }

  associate(data: RegularisationAssociation): Observable<BasicCode | null> {
    return this.http.post<BasicCode, RegularisationAssociation>('/api/rest/regularizacion/associate', data).pipe(map(value => {
      if (value) return value;
      return null;
    }));
  }

  private mapRegularisationToAdm(reg: Regularisation): RegularisationAdm {
    const newReg: RegularisationAdm = {
      code: reg.id,
      cantidad: reg.quantity,
      clasificacion: reg.classification,
      codeProvincia: reg.province.code,
      descripcionProvincia: reg.province.description,
      description: reg.description,
      estadoRegularizacion: reg.state,
      fechaRegistro: reg.registrationDate ? formatDate(reg.registrationDate, 'dd-MM-yyyy hh:mm:ss', 'es') : undefined,
      dateTo: reg.pasiveDate ? formatDate(reg.pasiveDate, 'dd-MM-yyyy hh:mm:ss', 'es') : undefined,
      incrementoDecremento: reg.balance,
      regCode: reg.code,
      tipoFacturacionCode: reg.billingType.code,
      codeCentro: reg.establishmentCode,
      facturacionEstablecimientoCode: reg.establishmentBillingCode,
      facturacionProvincialCode: reg.provincialBillingCode
    };
    return newReg;
  }

  private mapAdmToRegularisation(reg: RegularisationAdm): Regularisation {
    const billinType = this.constants.billingTypes.find(t => t.code === reg.tipoFacturacionCode);
    const newReg: Regularisation = {
      balance: reg.incrementoDecremento as RegularisationBalanceCodes,
      billingType: {
        code: billinType?.code || '',
        description: billinType?.description || ''
      },
      id: reg.code,
      code: reg.regCode,
      description: reg.description,
      province: {
        code: reg.codeProvincia,
        description: reg.descripcionProvincia
      },
      classification: reg.clasificacion as RegularisationClassificationCodes,
      state: reg.estadoRegularizacion as RegularisationStates,
      quantity: reg.cantidad,
      establishmentBillingCode: reg.facturacionEstablecimientoCode,
      provincialBillingCode: reg.facturacionProvincialCode,
      establishmentCode: reg.codeCentro,
      pasiveDate: reg.dateTo ? new Date(reg.dateTo) : undefined,
      status: reg.dateTo ? AdminStatus.PASIVE : AdminStatus.ACTIVE,
      registrationDate: reg.fechaRegistro ? new Date(reg.fechaRegistro) : undefined
    };
    return newReg;
  }

  private MOCK_REGULARISATIONS: Regularisation[] = [
    {
      id: '1',
      code: 'REG-001',
      description: 'Regularización por exceso de stock',
      province: {
        code: '08',
        description: 'Valladolid',
      },
      billingType: {
        code: 'BT1',
        description: 'Facturación normal',
      },
      establishmentCode: 'EST-001',
      quantity: 100,
      balance: RegularisationBalanceCodes.I,
      status: AdminStatus.ACTIVE,
      registrationDate: new Date('2025-01-10'),
      provincialBillingCode: 'PB-001',
      establishmentBillingCode: 'EB-001',
      classification: RegularisationClassificationCodes.P,
      state: RegularisationStates.PENDING,
    },
    {
      id: '2',
      code: 'REG-002',
      description: 'Regularización por devolución',
      province: {
        code: '03',
        description: 'León',
      },
      billingType: {
        code: 'BT2',
        description: 'Facturación especial',
      },
      establishmentCode: 'EST-002',
      quantity: 50,
      balance: RegularisationBalanceCodes.D,
      pasiveDate: new Date('2025-02-15'),
      status: AdminStatus.PASIVE,
      registrationDate: new Date('2025-02-01'),
      provincialBillingCode: 'PB-002',
      establishmentBillingCode: 'EB-002',
      classification: RegularisationClassificationCodes.Q,
      state: RegularisationStates.ASSOCIATED,
    },
    {
      id: '3',
      code: 'REG-003',
      description: 'Regularización por error administrativo',
      province: {
        code: '05',
        description: 'Salamanca',
      },
      billingType: {
        code: 'BT3',
        description: 'Facturación urgente',
      },
      establishmentCode: 'EST-003',
      quantity: 75,
      balance: RegularisationBalanceCodes.I,
      status: AdminStatus.ACTIVE,
      registrationDate: new Date('2025-03-01'),
      provincialBillingCode: 'PB-003',
      establishmentBillingCode: 'EB-003',
      classification: RegularisationClassificationCodes.P,
      state: RegularisationStates.PENDING,
    }
  ];
}
