import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceAuth } from 'src/app/services/service.auth';
import { Serviceenviarcorreo } from 'src/app/services/service.enviarcorreo';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css'],
})
export class RecuperarContrasenaComponent {
  @ViewChild('controlemail') controlEmail!: ElementRef;

  constructor(
    private _router: Router,
    private _serviceAuth: ServiceAuth,
    private _serviceenviarcorreo: Serviceenviarcorreo
  ) {}
  recuperarcontrasenia(): void {
    let email = this.controlEmail.nativeElement.value;
    let mensaje = '';
    let asunto = 'Recuperar contraseña';
    this._serviceenviarcorreo.getTokenPass(email).subscribe((response) => {
      console.log(response);
      mensaje= "Este es su enlace para modifcar su contraseña: http://localhost:4200/modificarcontrasenyatoken/"+response
      this._serviceenviarcorreo
        .enviarCorreoContrasena(email, asunto, mensaje)
        .subscribe((response) => {});
    });
  }
}
