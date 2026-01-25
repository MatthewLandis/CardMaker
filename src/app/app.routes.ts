import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CardMaker } from './cardmaker/cardmaker';

export const routes: Routes = [
    { path: '', component: CardMaker, title: 'CardMaker' },
    {
        path: '**',
        component: CardMaker,
        resolve: {
            clean: () => inject(Router).navigate(['/'], { replaceUrl: true }),
        },
    },
];

// djas: Here, I configured your router. Anything that matches and empty path will default to your cardmaker component.
// Also, the ** path above will essentially route the user back to cardmaker if they attempt to access a route that doesn't exist like localhost/asdasd
