import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Charla } from 'src/app/models/Charla';
import { DetallesEstadoCharlaTech } from 'src/app/models/DetallesEstadoCharlaTechRiders';
import { MailModel } from 'src/app/models/MailModel';
import { TecnologiaCharla } from 'src/app/models/TecnologiaCharla';
import { ServiceCharlas } from 'src/app/services/service.charlas';
import { ServiceLogicapps } from 'src/app/services/service.logicapps';
import { ServiceQueryTools } from 'src/app/services/service.querytools';
import { ServiceSolicitudAcreditacionesCharlas } from 'src/app/services/service.solicitudacreditacionescharlas';
import { ServiceTecnologias } from 'src/app/services/service.tecnologias';
import { ServiceTecnologiasCharlas } from 'src/app/services/service.tecnologiascharlas';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detallescharla',
  templateUrl: './detallescharla.component.html',
  styleUrls: ['./detallescharla.component.css'],
})
export class DetallescharlaComponent implements OnInit {
  public charla!: any;
  public tecnologias: string[] = [];
  public tecnologiasCargadas: boolean = false;
  //Modificion Mauricio
  public idUsuario!: number;
  public idEstadoCharlaCompl: number;

  constructor(
    private _serviceQueryTools: ServiceQueryTools,
    private _serviceTecnologiasCharlas: ServiceTecnologiasCharlas,
    private _serviceTecnologias: ServiceTecnologias,
    private _activeRoute: ActivatedRoute,

    private _serviceMail: ServiceLogicapps,
    private _serviceSolicitudAcred: ServiceSolicitudAcreditacionesCharlas,
    private _serviceCharlas: ServiceCharlas
  ) {
    this.idUsuario = parseInt(localStorage.getItem('idUsuario')!);
    this.idEstadoCharlaCompl = 5;
  }

  ngOnInit(): void {
    this._activeRoute.params.subscribe((params: Params) => {
      if (params['idcharla']) {
        let idcharla = parseInt(params['idcharla']);
        this._serviceQueryTools
          .findCharlaView(idcharla)
          .subscribe((response) => {
            this.charla = response;
          });
        this._serviceTecnologiasCharlas
          .getTecnologiasCharla(idcharla)
          .subscribe((response: TecnologiaCharla[]) => {
            if (response.length > 0) {
              response.forEach((tecnologia: TecnologiaCharla) => {
                this._serviceTecnologias
                  .findTecnologia(tecnologia.idTecnologia)
                  .subscribe((response) => {
                    this.tecnologias.push(response.nombreTecnologia);
                    this.tecnologiasCargadas = true;
                  });
              });
            } else this.tecnologiasCargadas = true;
          });
      }
    });
  }

  //Modificion Mauricio
  enviarSolicitudAcreditacion(): void {
    var charlaDetalles: DetallesEstadoCharlaTech = this
      .charla as DetallesEstadoCharlaTech;
    console.log(charlaDetalles);

    this._serviceCharlas.findCharla(charlaDetalles.idCharla).subscribe({
      next: (data: Charla) => {
        var linkpost =
          '<a href=' +
          data.acreditacionLinkedIn +
          '>' +
          data.acreditacionLinkedIn +
          '</a>';
        if (data.acreditacionLinkedIn == null) {
          linkpost =
            '<p>No se ha asignado el link a la acreditación en LinkedIn para esta charla.</p>';
        }
        var correo: MailModel = {
          email: 'hectormauricio.almaraz@tajamar365.com',
          asunto: 'Solicitud de acreditación charla',
          mensaje:
            `
          <h4>Solicitud acreditación</h4>
          <p>
            El TechRider ` +
            charlaDetalles.email +
            ` ha solicitado la acreditación para la charla ` +
            charlaDetalles.descripcionCharla +
            ` que tuvo lugar el ` +
            charlaDetalles.fechaCharla +
            `.
          </p>
          ` +
            linkpost,
        };
        this._serviceMail.sendMail(correo).subscribe({
          complete: () => {
            this._serviceSolicitudAcred
              .createSolicitudAcreditacionCharla(charlaDetalles.idCharla)
              .subscribe({
                complete: () => {
                  Swal.fire({
                    color: '#333333',
                    icon: 'success',
                    text: 'El proceso ha sido exitoso',
                    title: 'Operación completada',
                    confirmButtonColor: '#212529',
                    timer: 1500,
                  });
                },
              });
          },
        });
      },
    });
  }
}
