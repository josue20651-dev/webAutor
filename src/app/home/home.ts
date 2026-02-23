import { Component } from '@angular/core';
import { Flow } from '../services/flow';

@Component({
  selector: 'app-home',
  imports: [],
  providers: [Flow],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  obraDestacada = {
    titulo: 'El Jardín de los Suspiros',
    precio: 16900,
    email: 'josue20650@gmail.com'
  };

  constructor(private flow: Flow) {}

  comprar(): void {
    const datosPago = {
      nombre: this.obraDestacada.titulo,
      precio: this.obraDestacada.precio,
      email:  this.obraDestacada.email
    };

    this.flow.crearPago(datosPago)
      .subscribe((resp: any) => {
        const url = resp.url + '?token=' + resp.token;
        window.location.href = url;
      });
  }
}
