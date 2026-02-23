import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Bibliografia } from './bibliografia/bibliografia';
import { Contacto } from './contacto/contacto';
import { Tienda } from './tienda/tienda';
import { Obras } from './obras/obras';

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
    }
];
