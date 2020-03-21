import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class LoginGuard implements CanActivate {

  constructor(public _usuarioService: UsuarioService, public router: Router) {}

  canActivate(): boolean {
    if (this._usuarioService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return true;
    }
  }
}
