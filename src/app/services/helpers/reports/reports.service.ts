import { FilterDispensingCenter, FilterGeneric, FilterPatient, FilterPrescriptor, ReportCriteria } from './../../../bean/models/listings';
import { Injectable } from '@angular/core';
import { ReportsDaoService } from '../../dao/reports-dao.service';
import { formatDate } from '@angular/common';

@Injectable()
export class ReportsService {

constructor(private reportsDaoService: ReportsDaoService) { }

  //Usado para consumoPresupuestario1 y consumoPresupuestario2
  getBudgetMonitoring(filter: FilterGeneric, option: number){
    const criteria: ReportCriteria = {
        estado: filter.state.code,
        gerencia: filter.province.code,
        fechaFin: formatDate(filter.endDate, 'yyyy-MM-dd', 'es'),
        fechaInicio: formatDate(filter.startDate, 'yyyy-MM-dd', 'es')      
    };

    return this.reportsDaoService.searchConsumo(option, criteria);
  }

  getConsumptionItems(filter: FilterGeneric){
    const criteria: ReportCriteria = {
        estado: filter.state.code,
        gerencia: filter.province.code,
        fechaFin: formatDate(filter.endDate, 'yyyy-MM-dd', 'es'),
        fechaInicio: formatDate(filter.startDate, 'yyyy-MM-dd', 'es')      
    };

    return this.reportsDaoService.searchArticulo(criteria);
  }

  getConsumptionEstablishment(filter: FilterGeneric){
    const criteria: ReportCriteria = {
        estado: filter.state.code,
        gerencia: filter.province.code,
        fechaFin: formatDate(filter.endDate, 'yyyy-MM-dd', 'es'),
        fechaInicio: formatDate(filter.startDate, 'yyyy-MM-dd', 'es')      
    };

    return this.reportsDaoService.searchEstablecimiento(criteria);
  }

  getConsumptionPrescriberEstablishment(filter: FilterPrescriptor){
    const criteria: ReportCriteria = {
        estado: filter.state.code,
        gerencia: filter.province.code,
        fechaFin: formatDate(filter.endDate, 'yyyy-MM-dd', 'es'),
        fechaInicio: formatDate(filter.startDate, 'yyyy-MM-dd', 'es'),
        prescriptor: filter.prescriptor 
    };

    return this.reportsDaoService.searchPrescriptorEstablecimiento(criteria);
  }

  getConsumptionEstablishmentPrescriber(filter: FilterDispensingCenter){
    const criteria: ReportCriteria = {
        estado: filter.state.code,
        gerencia: filter.province.code,
        fechaFin: formatDate(filter.endDate, 'yyyy-MM-dd', 'es'),
        fechaInicio: formatDate(filter.startDate, 'yyyy-MM-dd', 'es'),
        establecimiento: filter.dispensingCenter 
    };

    return this.reportsDaoService.searchEstablecimientoPrescriptor(criteria);
  }

  getPatientConsumption(filter: FilterPatient){
    const criteria: ReportCriteria = {
        estado: filter.state.code,
        gerencia: filter.province.code,
        fechaFin: formatDate(filter.endDate, 'yyyy-MM-dd', 'es'),
        fechaInicio: formatDate(filter.startDate, 'yyyy-MM-dd', 'es'),  
        paciente:  filter.patient   
    };

    return this.reportsDaoService.searchPaciente(criteria);
  }
}

