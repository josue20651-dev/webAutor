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
      const token = params['token_ws'];
      if (token) {
        this.flow.getEstadoPago(token).subscribe({
          next: (resp: any) => {
            this.pago = {
              nombre: resp.subject,
              email:  resp.payer,
              precio: resp.amount,
              token:  token,
            };
          },
          error: () => {
            this.error = true;
          }
        });
      } else {
        this.error = true;
      }
    });
  }
}
