import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { versionBundleCriteria } from '../../bean/fhir-r3/criterias/fhir-criterias';
import { BundleModel } from '../../bean/fhir-r3/domain/bundle';
import { Bundle, BundleEntry } from '../../bean/fhir-r3/domain/interfaces/bundle.interface';
import { FhirResource } from '../../bean/fhir-r3/domain/interfaces/common.interface';
import { DeviceStatus, FhirTypes } from '../../bean/fhir-r3/fhir-constants';
import { HttpService } from '../http.service';
import { BundleDao } from './interfaces/bundle-dao.interface';
import { Prescription } from '../../bean/models/prescription';
import { MedicationRequest } from 'fhir/r3';



@Injectable({
  providedIn: 'root'
})
export class BundleDaoService implements BundleDao {

  private apiUrl = '/api/hdr/fhir/Bundle';

  constructor(private http: HttpService) { }

  //Special call to update bundle entries, update via post
  updateResource(data: BundleEntry<FhirResource>[]): Observable<Bundle<FhirResource> | null> {
    const body: Bundle<FhirResource> = {
      entry: data?.map(e => <BundleEntry<FhirResource>>{
        fullUrl: `${e.resource?.resourceType}/${e.resource?.id}`,
        request: { method: 'PUT', url: `${e.resource?.resourceType}/${e.resource?.id}` },
        resource: e.resource
      }), resourceType: FhirTypes.BUNDLE, total: data?.length, type: 'transaction'
    };
    return this.http.post<Bundle<FhirResource>, Bundle<FhirResource>>('/api/hdr/fhir', body);
  }

  update(request: string, bundle: BundleModel) {
    this.getByIdentifier(request).subscribe(
      data => {
        if (data) {
          const modData = data.entry?.at(0)?.resource as Bundle<FhirResource>;
          const entries = bundle.getEntriesByEntries(modData.entry);
          modData.entry = entries;
          if (entries.length > 0 && modData.id) {
            this.http.put<Bundle<Bundle<FhirResource>>, Bundle<FhirResource>>(this.apiUrl + '/' + modData.id, modData).subscribe();
          }
        }
      }
    );
  }

  getByIdentifier(id: string): Observable<Bundle<Bundle> | null> {
    return this.http.get<Bundle<Bundle>>(this.apiUrl, { params: versionBundleCriteria(id) });
  }

  getHistory(bundleId: string): Observable<Bundle<Bundle> | null> {
    return this.http.get<Bundle<Bundle>>(`${this.apiUrl}/${bundleId}/_history`);
  }

  getVersion(bundleId: string, version: number): Observable<Bundle<Bundle> | null> {
    return this.http.get<Bundle<Bundle>>(`${this.apiUrl}/${bundleId}/_history/${version}`);
  }

}