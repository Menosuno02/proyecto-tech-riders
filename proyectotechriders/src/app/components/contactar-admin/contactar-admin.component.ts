import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceEmail } from 'src/app/services/service.email';

@Component({
  selector: 'app-contactar-admin',
  templateUrl: './contactar-admin.component.html',
  styleUrls: ['./contactar-admin.component.css'],
})
export class ContactarAdminComponent {
  @ViewChild('controlasunto') controlAsunto!: ElementRef;
  @ViewChild('controlcomentarios') controlComentarios!: ElementRef;
  constructor(private _router: Router,
    private _serviceEmail: ServiceEmail) { }

  enviarSolicitud(): void {
    let asunto = this.controlAsunto.nativeElement.value;
    let cuerpo = this.controlComentarios.nativeElement.value;

    //Implementar el Service en API
    this._serviceEmail
      .sendEmail(asunto, cuerpo)
      .subscribe((response) => {
        console.log(response);
      });

    this._router.navigate(['/usuario/perfil']);
  }
}
