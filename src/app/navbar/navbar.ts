import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements AfterViewInit {

  menuAbierto = false;

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
    document.body.style.overflow = this.menuAbierto ? 'hidden' : '';
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
    document.body.style.overflow = '';
  }

  ngAfterViewInit(): void {
    this.initCursor();
    this.initScrollReveal();
  }

  private initCursor(): void {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let rx = 0, ry = 0, mx = 0, my = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    const animateRing = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    const hoverTargets = 'a, button, h3, .productos, .publicacion, .obra-card, li';
    document.addEventListener('mouseover', (e) => {
      if ((e.target as Element).closest(hoverTargets)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if ((e.target as Element).closest(hoverTargets)) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  private initScrollReveal(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    const observe = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
    };

    observe();

    const mutObs = new MutationObserver(observe);
    mutObs.observe(document.body, { childList: true, subtree: true });
  }
}