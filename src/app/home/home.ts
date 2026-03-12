import { Component } from '@angular/core';
import { Flow } from '../services/flow';

@Component({
  selector: 'app-home',
  imports: [],
  providers: [Flow],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  slideActivo: number = 0;
  readonly totalSlides = 3;

  nextSlide() {
    this.slideActivo = (this.slideActivo + 1) % this.totalSlides;
  }

  prevSlide() {
    this.slideActivo = (this.slideActivo - 1 + this.totalSlides) % this.totalSlides;
  }

  irASlide(index: number) {
    this.slideActivo = index;
  }
}
