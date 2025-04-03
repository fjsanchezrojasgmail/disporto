import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { mapFhirHttpError } from '../bean/fhir-r3/mappers/fhir.mapper';
import { ConfigService } from './config.service';
import { GlobalFeedbackService } from './global-feedback.service';
import { LoadService } from './load.service';

export type HttpOptions = {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  context?: HttpContext;
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
}

export type SimpleError = {
  title: string,
  message: string,
  severity: string,
}

export type CodeError = {
  code: string,
  msg: string,
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient,
    private loadService: LoadService,
    private config: ConfigService,
    private feedbackService: GlobalFeedbackService) { }

  get<T>(path: string, options: HttpOptions = {}): Observable<T | null> {
    const request$ = this.httpClient.get<T>(path, options);
    return this.doRequest(request$);
  }

  post<T, D>(path: string, body: D, options: HttpOptions = {}): Observable<T | null> {
    const request$ = this.httpClient.post<T>(path, body, options);
    return this.doRequest(request$);
  }

  put<T, D>(path: string, body: D, options: HttpOptions = {}): Observable<T | null> {
    const request$ = this.httpClient.put<T>(path, body, options);
    return this.doRequest(request$);
  }

  patch<T>(path: string, options: HttpOptions = {}): Observable<T | null> {
    const request$ = this.httpClient.patch<T>(path, options);
    return this.doRequest(request$);
  }

  delete<T>(path: string, options: HttpOptions = {}): Observable<T | null> {
    const request$ = this.httpClient.delete<T>(path, options);
    return this.doRequest(request$);
  }

  doRequest<T>(request: Observable<T | CodeError>) {
    this.loadService.startRequest();
    return request.pipe(
      catchError(err => {
        return this.handleError(err);
      }),
      //No se, si no pones los dos, con algunos datos basicos no funcona el subscribe
      map(data => data),
      mergeMap(data => {
        this.loadService.endRequest();
        //se revisa que no haya error en una llamada OK
        if (data && typeof data === 'object' && 'msg' in data && 'code' in data) {
          this.feedbackService.showErrorMessage((data as CodeError).msg);
          return of(null);
        }
        return of(data);
      })

      /* data => {
        this.loadService.endRequest();
        data.pipe(map(d => {
          if (d && 'msg' in d && 'code' in d) {
            this.feedbackService.showErrorMessage((d as unknown as CodeError).msg);
          }
        }));
        //se revisa que no haya error en una llamada OK
        return data;
      }*/
    );
  }

  private handleError(errorResp: HttpErrorResponse): Observable<null> {
    this.loadService.endRequest();
    const errors = mapFhirHttpError(errorResp);
    if (errors) {
      errors.forEach((err, index) => this.feedbackService.showCustomMessage({
        text: err.message,
        severity: err.severity,
        life: this.config.properties.messageLife + (this.config.properties.messageLife * index / 2)
      }));
    } else {
      switch (errorResp.status) {
        case 404: {
          this.feedbackService.showErrorMessage('Not Found (404)');
          console.log(`Not Found: ${errorResp.message}`);
          break;
        }
        case 403: {
          this.feedbackService.showErrorMessage('Access Denied (403)');
          console.log(`Access Denied: ${errorResp.message}`);
          break;
        }
        case 500: {
          this.feedbackService.showErrorMessage('Internal Server Error (500)');
          console.log(`Internal Server Error: ${errorResp.message}`);
          break;
        }
        default: {
          this.feedbackService.showErrorMessage('Unknown Server Error');
          console.log(`Unknown Server Error: ${errorResp.message}`);
          break;
        }
      }
    }

    return of(null);
  }
}
