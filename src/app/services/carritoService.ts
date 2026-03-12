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
    if (!novela.fisico && !novela.online) {
      alert("Selecciona al menos 1 versión de la novela");
      return;
    }

    // Si eligió físico, lo agrega como item separado
    if (novela.fisico) {
      const idFisico = `${novela.id}_fisico`;
      const existeFisico = this.items.find(item => item.itemId === idFisico);
      if (!existeFisico) {
        this.items.push({
          ...novela,  
          itemId: idFisico,
          tipo: 'Edición Física',
          esFisico: true,
        });
      }
    }

    // Si eligió online, lo agrega como item separado
    if (novela.online) {
      const idOnline = `${novela.id}_online`;
      const existeOnline = this.items.find(item => item.itemId === idOnline);
      if (!existeOnline) {
        this.items.push({
          ...novela,
          itemId: idOnline,
          tipo: 'eBook',
          esFisico: false,
        });
      }
    }

    this.guardarStorage();
  }

  eliminarCarrito(novela: any) {
    // Ahora elimina por itemId en vez de id
    const index = this.items.findIndex(item => item.itemId === novela.itemId);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.guardarStorage();
    }
  }

  // Verifica si hay al menos un físico para cobrar envío
  get tienesFisico(): boolean {
    return this.items.some(item => item.esFisico);
  }

  get costoEnvio(): number {
    return this.tienesFisico ? 5490 : 0;
  }

  get total(): number {
    const subtotal = this.items.reduce((acc, item) => acc + item.precio, 0);
    return subtotal + this.costoEnvio;
  }
}