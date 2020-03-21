import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService, ModalUploadService } from '../../services/service.index';
declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  totalRegistro: number = 0;

  constructor(public medicoService: MedicoService, public modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarMedicos();

    this.modalUploadService.notificacion
        .subscribe( resp => {
          this.cargarMedicos();
        });
  }

  cargarMedicos() {
    this.medicoService.cargarMedicos(this.desde)
      .subscribe((res: any) => {
        this.medicos = res.medicos;
        this.totalRegistro = res.total;
      });
  }

  cambiarDesde( valor: number ) {

    let desde = this.desde + valor;

    if ( desde >= this.totalRegistro ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();

  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('medicos', id);
  }

  buscarMedico( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this.medicoService.buscarMedicos( termino )
            .subscribe( (medicos: Medico[]) => {
              this.medicos = medicos;
            });

  }

  borrarHospital( medico: Medico ) {

    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {

      if (borrar) {

        this.medicoService.borrarMedico( medico._id )
                  .subscribe( borrado => {
                      this.cargarMedicos();
                  });
      }

    });

  }

}
