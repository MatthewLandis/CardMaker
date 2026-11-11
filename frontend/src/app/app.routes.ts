import { Routes } from '@angular/router';
import { CardMaker } from './cardmaker/cardmaker';
import { CardCatalog } from './card-catalog/card-catalog';

export const routes: Routes = [
    { path: '', component: CardMaker, title: 'CardMaker' },
    { path: 'cardCatalog', component: CardCatalog, title: 'CardCatalog' },
    { path: '**', redirectTo: '' }, // Any unknown URL goes back to the card maker
];
