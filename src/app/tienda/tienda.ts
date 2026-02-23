import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Flow } from '../services/flow';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-tienda',
  imports: [CommonModule, FormsModule],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class Tienda {

  novelas: any[] = [{
    precio: 5000,
    titulo: "novela prueba"
  }];

  precio: number = 5000;
  titulo: string = "Novela prueba";
  email: string = "josue20650@gmail.com";

  constructor(private flow: Flow){}

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
