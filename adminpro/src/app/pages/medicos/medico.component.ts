import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { HospitalService, MedicoService, ModalUploadService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', null, '');
  hospital: Hospital = new Hospital('');

  constructor(
    public hospitalService: HospitalService,
    public medicoService: MedicoService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public modalUploadService: ModalUploadService

  ) {
    activatedRoute.params.subscribe( params => {

      let id = params['id'];
      if ( id !== 'nuevo' ) {
        this.cargarMedico( id );
      }

    });
  }

  ngOnInit() {
    this.hospitalService.cargarHospitales()
      .subscribe((resp: any) => this.hospitales = resp.hospitales);

    this.modalUploadService.notificacion
        .subscribe( resp => {
          this.medico.img = resp.medico.img;
        });
  }

  cambioHospital( id: string ) {
    if (id === 'null') {
      this.hospital = new Hospital('');
      return;
    }

    this.hospitalService.obteneHospital( id )
          .subscribe( hospital => this.hospital = hospital );
  }

  guardarMedico( f: NgForm ) {

    if ( f.invalid ) {
      return;
    }

    this.medicoService.guardarMedico( this.medico )
        .subscribe( medico => {
          this.medico._id = medico._id;
          this.router.navigate(['/medico', medico._id ]);
        });

  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal( 'medicos', this.medico._id );
  }

  cargarMedico( id: string ) {
    this.medicoService.cargarMedico( id )
          .subscribe( medico => {
            this.medico = medico;
            this.medico.hospital = medico.hospital._id;
            this.cambioHospital( medico.hospital );
          });
  }

}
