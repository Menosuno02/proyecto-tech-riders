import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class ServiceEmail {
  constructor(private _http: HttpClient) {}
  private url = 'https://prod-20.westeurope.logic.azure.com:443/workflows/216f431a7f404a9590edb4bb69dcf216/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=UvB5yB-dXP-9tNyi9fxnODl3QyULN-Cl_95ZJtkCeeY';
  
  sendEmail(asunto: string, cuerpo: string): Observable<any> {
    let header = { 
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + localStorage.getItem('token') 
    };
    const body = JSON.stringify({
      'asunto': asunto,
      'cuerpo': cuerpo
    });

    return this._http.post(this.url, body, {headers: header});
  }
}