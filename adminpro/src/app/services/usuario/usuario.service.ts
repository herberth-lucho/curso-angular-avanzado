import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from '../../config/config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import swal from 'sweetalert';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
// import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/Operators';
import { _throw as throwError } from 'rxjs/observable/throw';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(private http: HttpClient, public router: Router, public subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  crearUsuario(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
      .map((res: any) => {
        swal('Usuario crado', usuario.email, 'success');
        return res.usuario;
      });
  }

  logout() {
    this.token = '';
    this.usuario = null;
    this.menu = [];

    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu?: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    if (menu !== undefined) {
      localStorage.setItem('menu', JSON.stringify(menu));
    }

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  loginGoogle(token: string) {
    let url = URL_SERVICIOS + '/login/google';

    return this.http.post(url, { token })
      .map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
      });
  }

  login(usuario: Usuario, recordar: boolean = false) {
    let url = URL_SERVICIOS + '/login';

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http.post(url, usuario)
      .map((resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);

        return true;
      })
      .pipe(catchError(this.handleServerError));
  }

handleServerError(error: any | any ) {
    // console.log(error.error || error.json() || error);
    swal('Error', error.error.mensaje, 'error');
    return throwError(error.error || error.json() || error || 'Server error');
}

handleServerErrorAuth(error: any | any ) {
    this.router.navigate(['/login']);
    swal('Error', error.error.mensaje, 'error');
    return throwError(error.error || error.json() || error || 'Server error');
}

renuevaToken() {
  let url = URL_SERVICIOS + '/login/renuevatoken/';
  url += '?token=' + this.token;

  return this.http.get(url)
    .map((resp: any) => {
      this.token = resp.token;
      localStorage.setItem('token', resp.token);
      console.log('token renovado');
      return true;
    })
    .pipe(catchError(this.handleServerErrorAuth));
}

actualizarUser(usuario: Usuario) {
    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario)
      .map((resp: any) => {
        let user: Usuario = resp.usuario;
        if (usuario._id === this.usuario._id) {
          this.guardarStorage(user._id, this.token, user);
        }

        swal('Usuario actualizado', user.nombre, 'success');
        return true;
      });
  }

  cambiarImagen(archivo: File, id: string) {
    this.subirArchivoService.subirArchivo(archivo, 'usuarios', id)
      .then( (resp: any) => {
        this.usuario.img = resp.usuario.img;
        swal('Imagen actualizada', this.usuario.nombre, 'success');
        this.guardarStorage(id, this.token, this.usuario, resp.menu);
      })
      .catch( resp => {
        console.log(resp);
      });
  }

  cargarusuarios(desde: Number = 0) {
    let url = URL_SERVICIOS + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
      .map( (resp: any) => resp.usuarios);
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICIOS + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url)
      .map( resp => {
        swal('usuario borrado', 'El usuario ha sido eliminado exitosamente', 'success');
        return true;
      });
  }

  actualizarUsuario(usuario: Usuario) {}

}
