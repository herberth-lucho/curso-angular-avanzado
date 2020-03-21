import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {
    this.contarTres().then(
      msg => console.log('termino', msg)
    )
    .catch(error => console.error('error en la promesa', error));
  }

  ngOnInit() {
  }

  contarTres(): Promise<string> {
    return new Promise((resolve, reject) => {
      let contador = 0;
      let intervalo = setInterval( () => {
        contador += 1;
        console.log(contador);
        if (contador === 3) {
          resolve('ok!');
          // reject('msg error');
          clearInterval(intervalo);
        }
      }, 1000);
    });
  }

}
