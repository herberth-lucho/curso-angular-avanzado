import { Component, OnInit } from '@angular/core';
import { HospitalService, ModalUploadService } from '../../services/service.index';
import { Hospital } from '../../models/hospital.model';
declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  desde: number = 0;
  hospitales: Hospital[] = [];
  totalRegistro: number = 0;
  cargando: boolean = false;

  constructor(private hospitalService: HospitalService, public modalUploadService: ModalUploadService) { }

  ngOnInit() {
    this.cargarHospitales();
    this.modalUploadService.notificacion
      .subscribe(resp => this.cargarHospitales());
  }

  crearhospital() {
    swal({
      title: 'Crear hospital',
      text: 'Digite el nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true,
    }).then( (valor: string) => {
      if (!valor || valor.length === 0) {
        return;
      }

      this.hospitalService.crearHospital(valor)
        .subscribe(() => this.cargarHospitales());
    });
  }

  actualizarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital)
      .subscribe();
  }

  buscarHospital( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;
    this.hospitalService.buscarHospitales( termino )
            .subscribe( (hospitales: Hospital[]) => {
              this.hospitales = hospitales;
              this.cargando = false;
            });

  }

  borrarHospital( hospital: Hospital ) {

    swal({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {

      if (borrar) {

        this.hospitalService.borrarHospital( hospital._id )
                  .subscribe( borrado => {
                      this.cargarHospitales();
                  });
      }

    });

  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde)
      .subscribe((res: any) => {
        this.cargando = false;
        this.hospitales = res.hospitales;
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
    this.cargarHospitales();

  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('hospitales', id);
  }

}
