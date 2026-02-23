import { Component } from '@angular/core';
<<<<<<< HEAD
=======
import { Flow } from '../services/flow';
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)

@Component({
  selector: 'app-home',
  imports: [],
<<<<<<< HEAD
=======
  providers: [Flow],
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

<<<<<<< HEAD
=======
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
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)
}
