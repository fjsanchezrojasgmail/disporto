import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadService {

  private ongoingCalls: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  calls$ = this.ongoingCalls.asObservable();

  private count = 0;
  private defaultLoaderId = 'loader';
  private encode = false;
  private encodeKey = '';
  private noEncodeParams: string[] = [];

  startRequest(): void {
    /* this.count = this.count + 1;
    if (this.count === 1) {
      this.displayStyle(this.defaultLoaderId, 'block')
    } */
    this.ongoingCalls.next(this.ongoingCalls.value + 1);
  }

  endRequest(): void {
    /* this.count = this.count - 1;
    if (this.count < 0) {
        this.count = 0;
    }
    if (this.count === 0) {
      this.displayStyle(this.defaultLoaderId, 'none')
    } */

    let currentCount = this.ongoingCalls.value - 1;
    if (currentCount < 0) currentCount = 0;
    this.ongoingCalls.next(currentCount);
  }

  setEncodedApp(encode: boolean) {
    this.encode = encode;
  }

  getEncodedApp() {
    return this.encode;
  }

  setEncodeKey(key: string) {
    this.encodeKey = key;
  }

  getEncodedKey() {
    return this.encodeKey;
  }

  setNoEncodeParams(listNoencodeParams: string[]) {
    this.noEncodeParams = listNoencodeParams;
  }

  addNoEncodeParam(param: string) {
    this.noEncodeParams.push(param);
  }

  getNoEncodeParams() {
    return this.noEncodeParams;
  }

  private displayStyle(id: string, style = 'display') {
    const element = document.getElementById(id);
    if (element && element.style) {
      element.style.display = style;
    }
  }
}
