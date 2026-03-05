import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Carrito } from "./carrito/carrito";
  
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Carrito],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('webAutor');
}
