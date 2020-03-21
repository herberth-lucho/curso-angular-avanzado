import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert';
import { Hospital } from '../../models/hospital.model';

@Injectable()
export class HospitalService {

  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

  cargarHospitales(desde: number = 0) {
    let url = URL_SERVICIOS + '/hospital?desde=' + desde;
    return this.http.get(url);
  }

  obteneHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url)
      .map( (res: any) => res.hospital);
  }

  crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital';
    url += '?token=' + this.usuarioService.token;
    return this.http.post(url, { nombre })
      .map((resp: any) => resp.hospital);
  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this.usuarioService.token;
    return this.http.put(url, hospital)
      .map((resp: any) => {
        swal('Hospital actualizado', hospital.nombre, 'success');
        return resp.hospital;
      });
  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    url += '?token=' + this.usuarioService.token;
    return this.http.delete(url)
      .map(resp => swal('Hospital borrado', 'Eliminado correctametne', 'success'));
  }

  buscarHospitales(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url)
      .map( (resp: any) => resp.hospitales);
  }

}
