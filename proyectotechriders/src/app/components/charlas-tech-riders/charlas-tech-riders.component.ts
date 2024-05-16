import { Component, OnInit } from '@angular/core';
import { CharlasPendientes } from 'src/app/models/CharlasPendientesTechRiders';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceQueryTools } from 'src/app/services/service.querytools';
import { ServiceCharlas } from 'src/app/services/service.charlas';
import { ServiceEmail } from 'src/app/services/service.email';
import { environment } from 'src/environments/environment';
import { ServiceUsuarios } from 'src/app/services/service.usuarios';
import { Usuario } from 'src/app/models/Usuario';

@Component({
  selector: 'app-charlas-tech-riders',
  templateUrl: './charlas-tech-riders.component.html',
  styleUrls: ['./charlas-tech-riders.component.css'],
})
export class CharlasTechRidersComponent implements OnInit {
  public charlasCargadas: boolean = false;
  public charlas: CharlasPendientes[] = [];
  public role!: number | null;

  constructor(
    private _serviceQueryTools: ServiceQueryTools,
    private _serviceCharlas: ServiceCharlas,
    private _serviceEmail: ServiceEmail,
    private _serviceUsuarios: ServiceUsuarios,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) this._router.navigate(['/login']);

    this.role = parseInt(localStorage.getItem('role') ?? '0');
    if (this.role == 3 || this.role == 4) {
      this._serviceQueryTools
        .charlasPorVerTechRiders()
        .subscribe((response) => {
          this.charlas = response;
          this.charlasCargadas = true;
        });
    } else this._router.navigate(['/usuario/perfil']);
  }

  asignarCharla(idcharla: number) {
    if (localStorage.getItem('idUsuario')) {
      Swal.fire({
        cancelButtonText: 'No',
        color: '#333333',
        confirmButtonColor: '#212529',
        confirmButtonText: 'Si, asignarse',
        icon: 'question',
        showCancelButton: true,
        text: 'Pasarás a hablar con el profesor sobre los detalles de la charla. Podrás desasignarte si quieres',
        title: 'Asignarse a esta charla',
      }).then((result) => {
        if (result.isConfirmed) {
          let idUsuario = parseInt(localStorage.getItem('idUsuario') ?? '0');
          this._serviceCharlas
            .asignarseUnaCharlaTechRider(idUsuario, idcharla)
            .subscribe((response) => {
              this._serviceCharlas
                .updateEstadoCharla(idcharla, 3)
                .subscribe(() => {
                  this._serviceQueryTools.actualizacionCharlas();
                  this._serviceCharlas
                    .findCharla(idcharla)
                    .subscribe((response) => {
                      let idcurso: number = response.idCurso;
                      this._serviceQueryTools
                        .getCursosProfesorAll()
                        .subscribe((response) => {
                          let cursosProfesores: any[] = response;
                          let correos: string[] = [];
                          cursosProfesores.forEach((element) => {
                            if (element.idCurso == idcurso)
                              correos.push(element.emailProfesor);
                          });
                          this._serviceUsuarios
                            .getUsuarios()
                            .subscribe((response) => {
                              let usuarios: Usuario[] = response;
                              usuarios.forEach((usuario) => {
                                if (usuario.idRole == 1)
                                  correos.push(usuario.email);
                              });
                              correos.push(environment.emailAdmin);
                              let asunto: string = 'INFO CHARLA TECH RIDERS';
                              let mensaje: string = 'Asociar charla';
                              this._serviceEmail
                                .enviarMail(correos, asunto, mensaje)
                                .subscribe(() => {
                                  this._router.navigate(['/mischarlastech']);
                                });
                            });
                        });
                    });
                });
            });
        }
      });
    }
  }
}
