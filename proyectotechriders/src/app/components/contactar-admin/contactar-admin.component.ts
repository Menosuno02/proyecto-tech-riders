import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario';
import { ServiceEmail } from 'src/app/services/service.email';
import { ServiceUsuarios } from 'src/app/services/service.usuarios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contactar-admin',
  templateUrl: './contactar-admin.component.html',
  styleUrls: ['./contactar-admin.component.css'],
})
export class ContactarAdminComponent {
  //Modificaciones 13/05 GRUPO 8
  @ViewChild('controlasunto') controlAsunto!: ElementRef;
  @ViewChild('controlcomentarios') controlComentarios!: ElementRef;
  public mensaje!: string;
  public email!:string;
  public usuario!: Usuario;
  constructor(private _router: Router,
    private _serviceEmail: ServiceEmail,
    private _serviceUsuarios: ServiceUsuarios) { }
  enviarSolicitud(): void {
    let asunto = this.controlAsunto.nativeElement.value;
    let cuerpo = this.controlComentarios.nativeElement.value;

    if (cuerpo.length < 20) {
      this.mensaje = 'El comentario debe tener al menos 20 caracteres.';
    } else {
      this._serviceUsuarios.getPerfilUsuario().subscribe((response) => {
        this.usuario = response;
        cuerpo+="<br/><br/><strong>Interesado: " +this.usuario.email + "</strong>";
        this._serviceEmail
          .sendEmail(asunto, cuerpo)
          .subscribe((response) => {
            Swal.fire({
              color: '#333333',
              icon: 'success',
              title: 'Se ha envido correctamente',
              showConfirmButton: false,
              timer: 1500
            });
          });
        this._router.navigate(['/usuario/perfil']);
      });
    }
  }
}
