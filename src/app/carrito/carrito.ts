import { Component } from '@angular/core';
import { carritoService } from '../services/carritoService';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from "@angular/router";
@Component({
  selector: 'app-carrito',
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  constructor(public carrito: carritoService){}
}
