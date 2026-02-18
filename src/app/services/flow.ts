import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Flow {
  private api = 'http://localhost:3000';

  constructor(private http: HttpClient){}

  crearPago(data: any){
    return this.http.post(`${this.api}/crear-pago`, data);
  }

}
