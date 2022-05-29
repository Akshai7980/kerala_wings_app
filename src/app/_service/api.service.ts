/* eslint-disable arrow-body-style */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';

export const baseurl = 'https://keralawings.co.in/booking/api/';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(public httpNative: HTTP) {}

  post(path, param) {
    const headers = {
      Accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
    };
    return new Promise((resolve, reject) => {
      this.httpNative.post(baseurl + path, param, headers).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  postApiCall(path, param): Observable<any> {
    const headers = {
      Accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
    };
    return from(
      this.httpNative.post(baseurl + path, param, headers).then(
        (res) => {
          return JSON.parse(res.data);
        },
        (res) => console.log(res.data)
      )
    );
  }

  get(path: any): Observable<any> {
    const headers = {
      Accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
    };
    return from(
      this.httpNative.get(baseurl + path, {}, headers).then(
        (res) => {
          return JSON.parse(res.data);
        },
        (res) => console.log(res.data)
      )
    );
  }
}
