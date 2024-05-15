import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class Serviceenviarcorreo {
  constructor(private _http: HttpClient) {}

enviarCorreoContrasena(email: string, asunto: string, mensaje: string): Observable<any> {
    let url =environment.ulrLogicApp;
    let json = JSON.stringify({
      email: email,
      asunto: asunto,
      mensaje: mensaje
    });
    let header = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this._http.post(url, json, {headers: header});
  }

  cambiarpassword(password: string, codigo:string, email:string): Observable<any> {
    let url = environment.urlApiLocal;
    let request = 'api/usuarios/UpdatePassword/'+password + "/"+codigo +"/"+ email; 
    return this._http.put(url + request,null);
  }
  
  getTokenPass(email: string): Observable<any>{
    let url = environment.urlApiLocal;
    let request ="api/Usuarios/RecuperarTokenPass/"+email;
    return this._http.get(url + request);
  }
}


