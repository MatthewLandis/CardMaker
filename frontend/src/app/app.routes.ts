import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CardMaker } from './cardmaker/cardmaker';
import { CardCatalog } from './card-catalog/card-catalog';

export const routes: Routes = [
    { path: '', component: CardMaker, title: 'CardMaker' },
    { path: 'cardCatalog', component: CardCatalog, title: 'CardCatalog' },
    {
        path: '**',
        component: CardMaker,
        resolve: {
            clean: () => inject(Router).navigate(['/'], { replaceUrl: true }),
        },
    },
];