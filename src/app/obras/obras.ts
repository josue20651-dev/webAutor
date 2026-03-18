import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-obras',
  imports: [RouterModule],
  templateUrl: './obras.html',
  styleUrl: './obras.css',
})
export class Obras {
  obras = [
    {
      titulo: 'El Lobo y la Luna',
      subtitulo: 'Novela · Romance & Drama · Edición Fisica',
      anio: '2025',
      descripcion: 'Hay una leyenda que dice que cuando un hombre mira la luna, mira a la mujer que ama. En los caminos húmedos del sur de Chile, una casa llena de libros guarda un cofre con cartas, poemas y fotografías: fragmentos de un amor que parecía absoluto.',
      precio: '9,99 USD',
      genero: 'Romance',
      paginas: '—',
      edicion: 'eBook',
      imagen: '/ElLoboYLaLuna.jpg',  // ← agregar esto
    },
  ];
}
 