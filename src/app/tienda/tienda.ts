import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Flow } from '../services/flow';
import { FormsModule } from "@angular/forms";
import { RouterLink, RouterModule } from "@angular/router";
import { carritoService } from '../services/carritoService';

@Component({
  selector: 'app-tienda',
  imports: [CommonModule, FormsModule,  RouterModule],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class Tienda {

  novelas: any[] = [{
    id: 1,
    precio: 5000,
    titulo: "novela prueba",
  },
  {
    id: 2,
    precio: 6000,
    titulo: "novela prueba2",
  }   
  ];

  precio: number = 5000;
  titulo: string = "Novela prueba";
  email: string = "josue20650@gmail.com";

  constructor(private flow: Flow, public carrito: carritoService){}

  comprar(novela: any){

    const datosPago = {
      nombre: novela.titulo,
      precio: novela.precio,
      email: 'josue20650@gmail.com'
    };

    this.flow.crearPago(datosPago)
      .subscribe((resp: any) =>{
        const url = resp.url + '?token=' + resp.token;

        window.location.href = url;
      })
  }

}
