import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Flow {
  private api = environment.apiUrl;

  constructor(private http: HttpClient){}

  crearPago(data: any){
    return this.http.post(`${this.api}/crear-pago`, data);
  }

  getEstadoPago(token: string) {
    return this.http.get(`${this.api}/estado-pago`, { params: { token } });
  }

}
