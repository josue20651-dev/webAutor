import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Correo } from '../services/correo';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  form = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    mensaje: '',
  }
  
  constructor(private correo: Correo) {}

  enviaContacto(){
    if(!this.form.email || !this.form.mensaje || !this.form.nombre || !this.form.apellido){
      alert('Por favor complete los campos de nombre, apellido, correo y mensaje');
      return;
    }

    if(!this.form.telefono){
      this.form.telefono = 'No Ingresado'
    }
    this.correo.enviarContacto({
      nombre: this.form.nombre + ' ' + this.form.apellido,
      email: this.form.email,
      telefono: this.form.telefono,
      mensaje: this.form.mensaje
    }).subscribe({
      next: () => {
        alert('Mensaje enviado');
      },
      error: () => {
        alert('Error enviando mensaje');
      }
    });
  }
}
