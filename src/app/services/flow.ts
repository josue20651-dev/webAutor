import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { environment } from '../../environments/environment';
=======
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)

@Injectable({
  providedIn: 'root',
})
export class Flow {
<<<<<<< HEAD
  private api = environment.apiUrl;
=======
  private api = 'http://localhost:3000';
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)

  constructor(private http: HttpClient){}

  crearPago(data: any){
    return this.http.post(`${this.api}/crear-pago`, data);
  }

}
