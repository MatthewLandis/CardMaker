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