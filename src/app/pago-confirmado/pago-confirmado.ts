import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Flow } from '../services/flow';

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

        // ⚠️ Ajusta según la estructura real que imprima el console.log
        this.pago = {
          nombre: resp.subject || resp.data?.subject,
          email:  resp.payer || resp.data?.payer,
          precio: resp.amount || resp.data?.amount,
          token:  token,
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
