import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import swal from 'sweetalert';
import { Medico } from '../../models/medico.model';

@Injectable()
export class MedicoService {

  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }

  cargarMedicos(desde: number = 0) {
    let url = URL_SERVICIOS + '/medico?desde=' + desde;
    return this.http.get(url)
      .map((resp: any) => {
        return resp;
      });
  }

  buscarMedicos(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
      .map( (resp: any) => resp.medicos);
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    url += '?token=' + this.usuarioService.token;
    return this.http.delete(url)
      .map(resp => swal('Medico borrado', 'Eliminado correctametne', 'success'));
  }

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';
    if ( medico._id ) {
      // actualizando
      url += '/' + medico._id;
      url += '?token=' + this.usuarioService.token;

      return this.http.put( url, medico )
                .map( (resp: any) => {
                  swal('Médico Actualizado', medico.nombre, 'success');
                  return resp.medico;

                });

    }else {
      // creando
      url += '?token=' + this.usuarioService.token;
      return this.http.post( url, medico )
              .map( (resp: any) => {
                swal('Médico Creado', medico.nombre, 'success');
                return resp.medico;
              });
    }
  }

  cargarMedico( id: string ) {

    let url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get( url )
              .map( (resp: any) => resp.medico );

  }

}
