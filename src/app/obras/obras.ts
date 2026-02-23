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
      titulo: 'El Jardín de los Suspiros',
      subtitulo: 'Novela · Romance & Misterio',
      anio: '2019',
      descripcion: 'Una historia de amor imposible que se teje entre los secretos de una mansión andaluza. Sus páginas desprenden el aroma de la lavanda y la melancolía de lo que nunca fue dicho.',
      precio: '€16,90',
      genero: 'Romance',
      paginas: '342',
      edicion: 'Física & eBook',
    },
    {
      titulo: 'Las Voces del Alba',
      subtitulo: 'Novela · Drama',
      anio: '2021',
      descripcion: 'Tres generaciones de mujeres en un pueblo costero guardan un secreto que el mar amenaza con revelar. Una obra sobre la memoria, el silencio y la valentía de seguir viviendo.',
      precio: '€18,50',
      genero: 'Drama',
      paginas: '298',
      edicion: 'Física & eBook',
    },
    {
      titulo: 'Cartas sin Destino',
      subtitulo: 'Relatos cortos',
      anio: '2022',
      descripcion: 'Una colección de dieciséis relatos sobre encuentros efímeros y despedidas eternas. Cada historia cabe en una tarde, pero permanece durante años.',
      precio: '€12,00',
      genero: 'Relatos',
      paginas: '184',
      edicion: 'Física & eBook',
    },
    {
      titulo: 'El Peso de la Luz',
      subtitulo: 'Novela · Literaria',
      anio: '2024',
      descripcion: 'La historia de un fotógrafo que pierde la vista y redescubre el mundo a través de la escritura. Su obra más íntima y personal hasta la fecha.',
      precio: '€19,90',
      genero: 'Literaria',
      paginas: '410',
      edicion: 'Física & eBook',
    },
  ];
}
