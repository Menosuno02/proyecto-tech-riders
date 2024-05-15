import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Usuario } from 'src/app/models/Usuario';
import { ServiceAuth } from 'src/app/services/service.auth';
import { ServiceUsuarios } from 'src/app/services/service.usuarios';
import { Serviceenviarcorreo } from 'src/app/services/service.enviarcorreo';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-modificar-contrasenya-token',
  templateUrl: './modificar-contrasenya-token.component.html',
  styleUrls: ['./modificar-contrasenya-token.component.css'],
})
export class ModificarContrasenyaTokenComponent {
  @ViewChild('controlpass') controlpass!: ElementRef;
  @ViewChild('controlrepetir') controlrepetir!: ElementRef;
  @ViewChild('controlemail') controlemail!: ElementRef;
  private codigo!: string;

  constructor(
    private _router: Router,
    private _serviceUsuarios: ServiceUsuarios,
    private _route: ActivatedRoute,
    private _serviceenviarcorreo: Serviceenviarcorreo
  ) {}
  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this.codigo = params['codigo'];
    });
  }

  updatePassword(): void {
    let email = this.controlemail.nativeElement.value;
    let nueva = this.controlpass.nativeElement.value;
    let repetir = this.controlrepetir.nativeElement.value;
        if (nueva != repetir) {
          Swal.fire({
            color: '#333333',
            confirmButtonColor: '#212529',
            confirmButtonText: 'Cerrar',
            icon: 'error',
            text: 'Las dos contraseñas nuevas no son iguales',
            title: 'Error',
          });
        } else {
          this._serviceenviarcorreo.cambiarpassword(nueva, this.codigo, email).subscribe(response=>{
            Swal.fire({
              color: '#333333',
              icon: 'success',
              showConfirmButton: false,
              text: 'Contraseña modificada correctamente',
              timer: 4000,
              timerProgressBar: true,
              title: 'Modificado con éxito',
            }).then((result) => {
              this._router.navigate(['/login']);
            });


          });
        }
      }
  }

