import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Icard } from './cardmaker.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CardService {
    private http = inject(HttpClient);

    // Returns the id of the saved card (new or updated)
    public saveCard(cardData: Icard): Observable<{ id: number }> {
        return this.http.post<{ id: number }>(`${environment.apiUrl}/api/save`, cardData);
    }

    public getCardById(cardId: string): Observable<Icard> {
        return this.http.get<Icard>(`${environment.apiUrl}/api/card/${cardId}`);
    }

    public register(username: string, password: string): Observable<string> {
        return this.http.post<string>(`${environment.apiUrl}/api/register`, { username, password });
    }

    public login(username: string, password: string): Observable<string> {
        return this.http.post<string>(`${environment.apiUrl}/api/login`, { username, password });
    }
}
