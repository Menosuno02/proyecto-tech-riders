import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Provincia } from 'src/app/models/Provincia';
import { Usuario } from 'src/app/models/Usuario';
import { EmpresaCentro } from 'src/app/models/EmpresaCentro';
import { ServiceUsuarios } from 'src/app/services/service.usuarios';
import { ServiceProvincias } from 'src/app/services/service.provincias';
import { ServiceEmpresasCentros } from 'src/app/services/service.empresascentros';

@Component({
  selector: 'app-editarusuario',
  templateUrl: './editarusuario.component.html',
  styleUrls: ['./editarusuario.component.css'],
})
export class EditarusuarioComponent implements OnInit {
  public usuario!: Usuario;
  public provincias!: Provincia[];
  public empresaCentro!: EmpresaCentro;
  public empresaExists: boolean = false;
  public empresaLoaded: boolean = false;
  public role!: number;
  public publico: number = 0;

  // Usuario
  @ViewChild('controlnombre') controlNombre!: ElementRef;
  @ViewChild('controlapellidos') controlApellidos!: ElementRef;
  @ViewChild('controlemail') controlEmail!: ElementRef;
  @ViewChild('controltelefono') controlTelefono!: ElementRef;
  @ViewChild('controllinkedin') controlLinkedin!: ElementRef;
  @ViewChild('selectprovincia') selectProvincia!: ElementRef;
  @ViewChild('controlimagen') controlImagen!: ElementRef;

  // Empresa
  @ViewChild('controlnombreempresa') controlnombreempresa!: ElementRef;
  @ViewChild('controltelefonoempresa') controltelefonoempresa!: ElementRef;
  @ViewChild('cif') cif!: ElementRef;
  @ViewChild('direccion') direccion!: ElementRef;
  @ViewChild('personaContacto') personaContacto!: ElementRef;
  @ViewChild('razonsocial') razonsocial!: ElementRef;

  constructor(
    private _serviceUsuarios: ServiceUsuarios,
    private _serviceProvincias: ServiceProvincias,
    private _serviceEmpresasCentros: ServiceEmpresasCentros,
    private _router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this._serviceUsuarios.getPerfilUsuario().subscribe((response) => {
        this.usuario = response;
        this.publico = this.usuario.linkedInVisible;
        this.role = parseInt(localStorage.getItem('role') ?? '0');
        this._serviceProvincias.getProvincias().subscribe((response) => {
          this.provincias = response;
          if (this.role == 4 && this.usuario.idEmpresaCentro) {
            this.empresaExists = true;
            this._serviceEmpresasCentros
              .findEmpresaCentro(this.usuario.idEmpresaCentro)
              .subscribe((response) => {
                this.empresaLoaded = true;
                this.empresaCentro = response;
              });
          }
        });
      });
    } else this._router.navigate(['/login']);
  }

  editarPerfil(): void {
    // let usuario: Usuario = {
    //   idUsuario: this.usuario.idUsuario,
    //   nombre: this.controlNombre.nativeElement.value,
    //   apellidos: this.controlApellidos.nativeElement.value,
    //   email: this.controlEmail.nativeElement.value,
    //   telefono: this.controlTelefono.nativeElement.value,
    //   linkedIn: this.controlLinkedin.nativeElement.value,
    //   password: this.usuario.password,
    //   idRole: this.usuario.idRole,
    //   idProvincia: this.selectProvincia.nativeElement.selectedOptions[0].value,
    //   idEmpresaCentro: this.usuario.idEmpresaCentro,
    //   estado: this.usuario.estado,
    //   linkedInVisible: this.publico ? 1 : 0,
    //   imagen: this.controlImagen.nativeElement.files[0].name
    // };

    let formUsuario = new FormData();

    formUsuario.append('Usuario.IdUsuario', this.usuario.idUsuario.toString());
    formUsuario.append(
      'Usuario.Nombre',
      this.controlNombre.nativeElement.value
    );
    formUsuario.append(
      'Usuario.Apellidos',
      this.controlApellidos.nativeElement.value
    );
    formUsuario.append('Usuario.Email', this.controlEmail.nativeElement.value);
    formUsuario.append(
      'Usuario.Telefono',
      this.controlTelefono.nativeElement.value
    );
    formUsuario.append(
      'Usuario.LinkedIn',
      this.controlLinkedin.nativeElement.value
    );
    formUsuario.append('Usuario.Password', this.usuario.password);
    formUsuario.append('Usuario.IdRole', this.usuario.idRole.toString());
    formUsuario.append(
      'Usuario.IdProvincia',
      this.selectProvincia.nativeElement.selectedOptions[0].value
    );
    formUsuario.append(
      'Usuario.IdEmpresaCentro',
      this.usuario.idEmpresaCentro
        ? this.usuario.idEmpresaCentro.toString()
        : ''
    );
    formUsuario.append('Usuario.Estado', this.usuario.estado.toString());
    formUsuario.append('Usuario.LinkedInVisible', this.publico ? '1' : '0');

    const imageFile = this.controlImagen.nativeElement.files[0];
    if (imageFile) {
      formUsuario.append('Imagen', imageFile, imageFile.name);
    }

    this._serviceUsuarios.editUsuarioForm(formUsuario).subscribe((response) => {
      if (this.role == 4) {
        let empresa: EmpresaCentro = {
          idEmpresaCentro: this.empresaCentro.idEmpresaCentro,
          nombre: this.controlnombreempresa.nativeElement.value,
          direccion: this.direccion.nativeElement.value,
          telefono: this.controltelefonoempresa.nativeElement.value,
          personaContacto: this.personaContacto.nativeElement.value,
          cif: this.cif.nativeElement.value,
          idProvincia: this.empresaCentro.idProvincia,
          razonSocial: this.razonsocial.nativeElement.value,
          idTipoEmpresa: this.empresaCentro.idTipoEmpresa,
          estadoEmpresa: this.empresaCentro.estadoEmpresa,
        };
        this._serviceEmpresasCentros
          .editEmpresaUsuarioRepresentante(empresa)
          .subscribe((response) => {
            this._router.navigate(['/usuario/perfil']);
          });
      } else this._router.navigate(['/usuario/perfil']);
    });
  }
}
