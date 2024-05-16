import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Charla } from '../models/Charla';

@Injectable()
export class ServiceCharlas {
  constructor(private _http: HttpClient) {}

  asignarseUnaCharlaTechRider(
    idtech: number,
    idcharla: number
  ): Observable<any> {
    let url = environment.urlApi;
    let request =
      'api/Charlas/AsociarTechriderCharla/' + idtech + '/' + idcharla;

    let header = new HttpHeaders({
      Authorization: 'bearer ' + localStorage.getItem('token'),
    });
    return this._http.put(url + request, null, { headers: header });
  }

  updateEstadoCharla(
    idCharla: number,
    idEstadoCharla: number
  ): Observable<any> {
    let url = environment.urlApi;
    let request =
      'api/Charlas/UpdateEstadoCharla/' + idCharla + '/' + idEstadoCharla;
    let header = { Authorization: 'bearer ' + localStorage.getItem('token') };
    return this._http.put(url + request, null, { headers: header });
  }

  createCharla(charla: Charla): Observable<any> {
    let url = environment.urlApi;
    let request = 'api/Charlas';
    let json = JSON.stringify(charla);
    let header = {
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + localStorage.getItem('token'),
    };
    return this._http.post(url + request, json, { headers: header });
  }

  getCharlas(): Observable<any> {
    let url = environment.urlApi;
    let request = 'api/Charlas';
    return this._http.get(url + request);
  }

  findCharla(idCharla: number): Observable<any> {
    let url = environment.urlApi;
    let request = 'api/Charlas/' + idCharla;
    return this._http.get(url + request);
  }

  updateCharla(charla: Charla): Observable<any> {
    let url = environment.urlApi;
    let request = 'api/Charlas';
    let json = JSON.stringify(charla);
    let header = {
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + localStorage.getItem('token'),
    };
    return this._http.put(url + request, json, { headers: header });
  }

  //Implementado Jhon

  //Service, donde se prepara el envio de un email mediante Logic App.
  sendEmail(): void {
    var url="https://prod-125.westeurope.logic.azure.com:443/workflows/3cfb6aa59bc84569b929fea566c934a5/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=s3G4LnvgC48QcS3czWqYGO2kP3jnobw5RImtlyvUvBw";
 
    var correo={
         email : "fjhon868@gmail.com", //Correo Administrador
         asunto : "Charla Creada",
         mensaje : "Se ha creado una charla pero una de las tecnologias seleccionadas no esta asociada a ningun TechRider"
     };
    this._http.post(url,correo).subscribe({
      next:()=> {
       
      },
    });
  }

  //Service, para comprobar tecnologias seleccionadas con las tecnologias de los techriders, con el fin de saber si hay algun techrider sin esas
  //tecnologias.
  //Funcionamiento: Pasamos por parametro dos arrays de numeros, el primer array son las IDS de las tecnologias seleccionadas en el formulario y 
  //el otro array todas las IDS de tecnologias de los techriders asociados. Comparamos si existe los IDS del primer array en el segundo, si en 
  //caso es falso mandamos un email al Administrador. 
  checkIdsTecnologias(tecnologiaselect: number[], techridertecnologia: number[]): void {
    let numerosTecnologiaselect = tecnologiaselect.map(Number);
    let todosPresentes = numerosTecnologiaselect.every(numero => techridertecnologia.includes(numero));
    if (!todosPresentes) {
      console.log("Se ha enviado un mensaje al Admin");
      this.sendEmail();
    }
  }

  //Service, para obtener todas las tecnologias de los techriders(API).
  getTecnologiasTech(): Observable<any> {
    let url = environment.urlApi + 'api/tecnologiastechriders';
    return this._http.get(url);
  }
  //Fin implementación
}
