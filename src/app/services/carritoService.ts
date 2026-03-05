import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class carritoService {
  items: any[] = [];
  abierto: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const guardado = localStorage.getItem('carrito');
      if (guardado) {
        this.items = JSON.parse(guardado);
      }
    }
  }

  private guardarStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('carrito', JSON.stringify(this.items));
    }
  }

  toggleCarrito() {
    this.abierto = !this.abierto;
  }

  agregarCarrito(novela: any) {
    // Evita duplicados
    const existente = this.items.find(item => item.id === novela.id);
    if (!existente) {
      this.items.push(novela);
      this.guardarStorage();
    }
  }

  eliminarCarrito(novela: any) {
    const index = this.items.findIndex(item => item.id === novela.id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.guardarStorage();
    }
  }

  get total(): number {
    return this.items.reduce((acc, item) => acc + item.precio, 0);
  }
}