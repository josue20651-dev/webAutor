import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class Flow {
  private api = environment.apiUrl;

  constructor(private http: HttpClient){}

  crearPago(data: any){
    return this.http.post(`${this.api}/crear-pago`, data);
  }

}
