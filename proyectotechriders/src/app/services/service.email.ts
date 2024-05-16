import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ServiceEmail {
  constructor(private _http: HttpClient) {}

  sendEmail(asunto: string, cuerpo: string): Observable<any> {
    let url = environment.urlLogicContactoAdmin;
    let header = {
      'Content-Type': 'application/json',
    };
    let body = JSON.stringify({
      asunto: asunto,
      mensaje: cuerpo,
    });
    return this._http.post(url, body, { headers: header });
  }

  enviarMail(
    email: string[],
    asunto: string,
    mensaje: string
  ): Observable<any> {
    let url = environment.logicApp;
    let json = JSON.stringify({
      emails: email,
      asunto: asunto,
      mensaje: mensaje,
    });
    let header = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(url, json, { headers: header });
  }
}
