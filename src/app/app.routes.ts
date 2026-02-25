import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Bibliografia } from './bibliografia/bibliografia';
import { Contacto } from './contacto/contacto';
import { Tienda } from './tienda/tienda';
<<<<<<< HEAD
=======
import { Obras } from './obras/obras';
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)

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
<<<<<<< HEAD
=======
    },
    {
        path: "obras",
        component: Obras
>>>>>>> 4599050 (Cambios visuales y pestaña Obras)
    }
];
