import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MailModel } from '../models/MailModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceLogicapps {
  constructor(private http: HttpClient) {}

  public sendMail(mail: MailModel): Observable<any> {
    var url = environment.urlLogicMailJhon;
    var header = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post(url, mail, { headers: header });
  }
}
