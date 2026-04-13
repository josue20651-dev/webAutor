import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-obras',
  imports: [RouterModule],
  templateUrl: './obras.html',
  styleUrl: './obras.css',
})
export class Obras implements OnInit{

   constructor(
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit() {
    this.title.setTitle('Biografía | AustenJobs - Sobre el autor');

    this.meta.updateTag({
      name: 'description',
      content: 'Descubre todas las obras de AustenJobs. Una colección de novelas originales que exploran historias profundas, creativas y únicas.'
    });
  }

  obras = [
    {
      titulo: 'El Lobo y la Luna',
      subtitulo: 'Novela · Romance & Drama · Edición Fisica',
      anio: '2025',
      descripcion: 'Hay una leyenda que dice que cuando un hombre mira la luna, mira a la mujer que ama. En los caminos húmedos del sur de Chile, una casa llena de libros guarda un cofre con cartas, poemas y fotografías: fragmentos de un amor que parecía absoluto.',
      precio: '12.990 CLP',
      genero: 'Romance',
      paginas: '—',
      edicion: 'eBook',
      imagen: '/ElLoboYLaLuna.jpg',  
    },
  ];

  
}
 