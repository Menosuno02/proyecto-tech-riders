import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class ServiceEmail {
  constructor(private _http: HttpClient) {}
  private url = environment.urlLogicContactoAdmin;
  sendEmail(asunto: string, cuerpo: string): Observable<any> {
    let header = { 
      'Content-Type': 'application/json'
    };
    const body = JSON.stringify({
      'asunto': asunto,
      'mensaje': cuerpo
    });

    return this._http.post(this.url, body, {headers: header});
  }
}