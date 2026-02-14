import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Icard } from '../cardmaker/cardmaker.model';

@Injectable({
    providedIn: 'root',
})
export class CardCatalogService {
    private http = inject(HttpClient);

    public getCards(): Observable<Icard[]> {
        return this.http.get<Icard[]>(`http://localhost:4000/api/cards`);
    }

    public deleteCard(cardId: number | undefined): Observable<void> {
        return this.http.delete<void>(`http://localhost:4000/api/cards/${cardId}`);
    }
}
