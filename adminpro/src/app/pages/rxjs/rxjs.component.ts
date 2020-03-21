import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { retry, map, filter } from 'rxjs/Operators';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscripcion: Subscription;

  constructor() {
    this.subscripcion = this.regresaObservable()
    /* .pipe(
      retry(2)
    ) */
    .subscribe(
      numero => console.log(numero),
      error => console.error('Error', error),
      () => console.log('el observer termino')
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( (observer: Subscriber<any>) => {
      let contador = 0;
      let intervalor = setInterval( () => {
        contador++;

        const salida = {
          valor: contador
        };

        observer.next(salida);

        /* if (contador === 3) {
          clearInterval(intervalor);
          observer.complete();
        } */

        /* if (contador === 2) {
          // clearInterval(intervalor);
          observer.error('Help!');
        } */
      }, 1000);
    }).pipe(
      map( resp => resp.valor),
      filter( (valor, index) => {
        if ((valor % 2) === 1) {
          // impar
          return true;
        } else {
          // par
          return false;
        }
      })
    );
  }

}
