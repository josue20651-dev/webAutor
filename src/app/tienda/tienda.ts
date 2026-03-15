import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Flow } from '../services/flow';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { carritoService } from '../services/carritoService';
 
@Component({
  selector: 'app-tienda',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tienda.html',
  styleUrl: './tienda.css',
})
export class Tienda {
 
  novelas: any[] = [
    {
      id: 1,
      precio: 9.99,       // USD — el backend valida el precio real
      titulo: 'El Lobo y la Luna',
      descripcion: 'Hay una leyenda que dice que cuando un hombre mira la luna, mira a la mujer que ama. Un relato de amor, redención y segundas oportunidades.',
      imagen: '/ElLoboYLaLuna.jpg',
      fisico: false,
      online: false,
      fisicoProximo: true,  // ← desactiva la pill física y muestra tooltip
    },
  ];
 
  constructor(private flow: Flow, public carrito: carritoService) {}
}