import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Flow } from '../services/flow';
 
const COSTO_ENVIO = 5490; // Debe coincidir con el valor en server.ts
 
@Component({
  selector: 'app-pago-confirmado',
  imports: [CommonModule, RouterModule],
  templateUrl: './pago-confirmado.html',
  styleUrl: './pago-confirmado.css',
})
export class PagoConfirmado implements OnInit {
  pago: any = null;
  error: boolean = false;
 
  constructor(private route: ActivatedRoute, private flow: Flow) {}
 
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
 
      console.log('PARAMS:', params);
 
      const token = params['token_ws'];
 
      if (!token) {
        console.log('❌ No llegó token_ws');
        this.error = true;
        return;
      }
 
      console.log('✅ Token recibido:', token);
 
      this.flow.getEstadoPago(token).subscribe({
        next: (resp: any) => {
          console.log('✅ RESPUESTA BACKEND:', resp);
 
          const totalCobrado = resp.amount || resp.data?.amount || 0;
 
          // El subject de Flow contiene los títulos, revisamos si hay físicos
          // buscando la palabra "Física" en el subject
          const subject: string = resp.subject || resp.data?.subject || '';
          const tienesFisico = subject.toLowerCase().includes('física');
          const envio = tienesFisico ? COSTO_ENVIO : 0;
 
          this.pago = {
            nombre: subject,
            email:  resp.payer  || resp.data?.payer,
            precio: totalCobrado,
            envio,
            token,
          };
 
          console.log('🎉 Pago procesado:', this.pago);
        },
 
        error: (err) => {
          console.log('❌ ERROR consultando estado:', err);
          this.error = true;
        }
      });
    });
  }
}