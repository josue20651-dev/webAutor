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
    nombre:    '',
    apellido:  '',
    email:     '',
    telefono:  '',
    region:    '',
    comuna:    '',
    direccion: '',
  };
 
  constructor(public carrito: carritoService, private flow: Flow) {}
 
  pagar() {
    if (!this.form.nombre || !this.form.email) {
      alert('Por favor completa nombre y correo.');
      return;
    }
 
    // Si hay físicos, dirección es obligatoria
    if (this.carrito.tienesFisico && !this.form.direccion) {
      alert('Por favor ingresa una dirección de entrega para la edición física.');
      return;
    }
 
    const datosPago = {
      // Solo IDs al backend, nunca precios
      items: this.carrito.items.map(i => ({ id: i.id, tipo: i.tipo, esFisico: i.esFisico })),
      email:    this.form.email,
      nombre:   `${this.form.nombre} ${this.form.apellido}`,
      telefono: this.form.telefono || 'No ingresado',
      // Datos de entrega para el correo de confirmación
      entrega: {
        region:    this.form.region    || 'No indicada',
        comuna:    this.form.comuna    || 'No indicada',
        direccion: this.form.direccion || 'No aplica · solo digital',
      },
    };
 
    this.flow.crearPago(datosPago).subscribe((resp: any) => {
      this.carrito.items = [];
      localStorage.removeItem('carrito');
      window.location.href = resp.url + '?token=' + resp.token;
    });
  }
}