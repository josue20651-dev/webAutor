import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Correo {
  private api = environment.apiUrl;
  constructor(private http: HttpClient){}

  enviarContacto(data: any) {
    return this.http.post(`${this.api}/contacto`, data);
  }
}
