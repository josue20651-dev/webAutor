import { Component } from '@angular/core';
import { carritoService } from '../services/carritoService';
import { Flow } from '../services/flow';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finalizar-compra',
  imports: [CommonModule, FormsModule],
  templateUrl: './finalizar-compra.html',
  styleUrl: './finalizar-compra.css',
})
export class FinalizarCompra {
form = {
    nombre:   '',
    apellido: '',
    email:    '',
    telefono: '',
    pais:     'Chile',
    region:   '',
  };

  constructor(public carrito: carritoService, private flow: Flow) {}

  pagar() {
    // Validación básica
    if (!this.form.nombre || !this.form.email) {
      alert('Por favor completa nombre y correo.');
      return;
    }

    const datosPago = {
      items:  this.carrito.items,
      total:  this.carrito.total,
      email:  this.form.email,
      nombre: `${this.form.nombre} ${this.form.apellido}`,
    };

    this.flow.crearPago(datosPago).subscribe((resp: any) => {
      // Limpia el carrito antes de redirigir
      this.carrito.items = [];
      localStorage.removeItem('carrito');

      window.location.href = resp.url + '?token=' + resp.token;
    });
  }
}
