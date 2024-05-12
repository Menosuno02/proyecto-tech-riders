import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class ServiceEmail {
  constructor(private _http: HttpClient) {}

  sendEmail(asunto: string, cuerpo: string): Observable<any> {
    let url = environment.urlApi;
    let request = 'api/SendMail';
    let header = { 
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + localStorage.getItem('token') 
    };
    const body = JSON.stringify({
      'asunto': asunto,
      'cuerpo': cuerpo
    });

    return this._http.post(url + request, body, {headers: header});
  }
}