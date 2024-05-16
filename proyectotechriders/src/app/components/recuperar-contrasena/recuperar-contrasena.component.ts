import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Serviceenviarcorreo } from 'src/app/services/service.enviarcorreo';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css'],
})
export class RecuperarContrasenaComponent implements OnInit {
  public url: string = '';

  @ViewChild('controlemail') controlEmail!: ElementRef;

  constructor(private _serviceenviarcorreo: Serviceenviarcorreo) {}

  ngOnInit(): void {
    this.url = environment.domainUrl;
    console.log(this.url);
  }

  recuperarcontrasenia(): void {
    let email = this.controlEmail.nativeElement.value;
    let mensaje = '';
    let asunto = 'Recuperar contraseña';
    this._serviceenviarcorreo.getTokenPass(email).subscribe((response) => {
      console.log(response);
      mensaje =
        'Este es su enlace para modifcar su contraseña: ' +
        this.url +
        'modificarcontrasenyatoken/' +
        response;
      this._serviceenviarcorreo
        .enviarCorreoContrasena(email, asunto, mensaje)
        .subscribe((response) => {});
    });
  }
}
