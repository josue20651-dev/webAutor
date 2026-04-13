import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-bibliografia',
  imports: [],
  templateUrl: './bibliografia.html',
  styleUrl: './bibliografia.css',
})
export class Bibliografia implements OnInit {

  constructor(
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit() {
    this.title.setTitle('Biografía | AustenJobs - Sobre el autor');

    this.meta.updateTag({
      name: 'description',
      content: 'Conoce la historia detrás de AustenJobs, el autor de novelas originales que buscan transmitir emociones, arte y creatividad a través de sus obras.'
    });
  }
}
