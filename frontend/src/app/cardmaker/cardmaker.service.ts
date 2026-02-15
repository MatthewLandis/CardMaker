import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Icard } from './cardmaker.model';

@Injectable({
    providedIn: 'root',
})
export class CardService {
    private http = inject(HttpClient);

    public getCards(): Observable<Icard[]> {
        return this.http.get<Icard[]>(`http://localhost:4000/api/cards`);
    }

    public saveCard(cardData: Icard): Observable<void> {
        return this.http.post<void>(`http://localhost:4000/api/save`, cardData);
    }

    public getCardById(cardId: string | null): Observable<Icard> {
        return this.http.get<Icard>(`http://localhost:4000/api/card/${cardId}`);
    }
}
