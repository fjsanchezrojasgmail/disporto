import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { criteriaRGHistoric, criteriaRGHistoricWithFilter } from '../../../bean/fhir-r3/criterias/request-group-criteria';
import { SimplePatient } from '../../../bean/models/patient';
import { mapPrescriptions, Prescription, PrescriptionRow } from '../../../bean/models/prescription';
import { HistoricFilter } from '../../../bean/simple.types';
import { RequestGroupDaoService } from '../../dao/request-group-dao.service';
import { Bundle, DeviceRequest, FhirResource } from 'fhir/r3';
import { FhirDeviceRequestUrl } from '../../../bean/fhir-r3/fhir-url-constants';


@Injectable({
  providedIn: 'any'
})
export class HistoricalService {

  private prescriptions: BehaviorSubject<PrescriptionRow[]> = new BehaviorSubject<PrescriptionRow[]>([]);
  prescriptions$ = this.prescriptions.asObservable();

  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  constructor(private requestGroupDaoService: RequestGroupDaoService) { }

  expandProducts(code: string) {
    this.prescriptions.next(this.prescriptions.value.map(p => {
      if (p.id === code) p.expanded = !p.expanded;
      return p;
    }));
  }

  fetchProducts(patient: SimplePatient) {
    this.loading.next(true);
    this.requestGroupDaoService.search(criteriaRGHistoric(patient.id)).subscribe((data) => {
      if (data) {
        this.prescriptions.next(
          mapPrescriptions(
            data.mapToPrescriptionModel()));
        this.loading.next(false);
      }
    });
    /*this.requestGroupDaoService.fetchHistoric().subscribe((data) =>{
      if(data) {
        this.prescriptions.next(
          this.mapToPrescriptionModel(data));
          this.loading.next(false);

      }
    })*/
  }




  searchProducts(patient: SimplePatient, filter: HistoricFilter) {
    this.loading.next(true);
    this.requestGroupDaoService.search(criteriaRGHistoricWithFilter(patient.id, filter)).subscribe((data) => {
      if (data) {
        this.prescriptions.next(
          mapPrescriptions(
            data.mapToPrescriptionModel()));
        if (data.link && data.link.length > 1) {
          const next = data.link.find(e => e.relation === 'next')?.url;
          if (next) this.recursiveNextPages(next);
          else this.loading.next(false);
        }
        else this.loading.next(false);
      }
      else this.loading.next(false);
    });
  }

  recursiveNextPages(url: string) {
    this.requestGroupDaoService.page(url).subscribe(
      data => {
        if (data) {
          const newSet = mapPrescriptions(data.mapToPrescriptionModel());
          this.prescriptions.next([...this.prescriptions.value, ...newSet]);
          if (data.link && data.link.length > 1) {
            const next = data.link.find(e => e.relation === 'next')?.url;
            if (next) this.recursiveNextPages(next);
            else this.loading.next(false);
          }
          else this.loading.next(false);
        }
        else this.loading.next(false);
      }
    );
  }
}
