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

    public saveCard(cardData: Icard): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/api/save`, cardData, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    public getCardById(cardId: string | null): Observable<Icard> {
        return this.http.get<Icard>(`${environment.apiUrl}/api/card/${cardId}`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    public register(username: string, password: string): Observable<string> {
        return this.http.post<string>(`${environment.apiUrl}/api/register`, { username: username, password: password });
    }

    public login(username: string, password: string): Observable<string> {
        return this.http.post<string>(`${environment.apiUrl}/api/login`, { username: username, password: password });
    }
}
