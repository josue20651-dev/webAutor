import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
 
  slideActivo: number = 0;
  readonly totalSlides = 4;
 
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
 