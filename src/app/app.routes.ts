import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Bibliografia } from './bibliografia/bibliografia';
import { Contacto } from './contacto/contacto';
import { Tienda } from './tienda/tienda';
import { Obras } from './obras/obras';
import { PagoConfirmado } from './pago-confirmado/pago-confirmado';
import { FinalizarCompra } from './finalizar-compra/finalizar-compra';

export const routes: Routes = [
    {
        path: "",
        component: Home
    },
    {
        path: "bibliografia",
        component: Bibliografia
    },
    {
        path: "contacto",
        component: Contacto
    },
    {
        path: "tienda",
        component: Tienda
    },
    {
        path: "obras",
        component: Obras
    },
    {
        path: "pagoConfirmado",
        component: PagoConfirmado   
    },
    {
        path: "finalizarCompra",
        component: FinalizarCompra
    }
];
