import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Icard } from '../cardmaker/cardmaker.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CardCatalogService {
    private http = inject(HttpClient);

    public getCards(): Observable<Icard[]> {
        return this.http.get<Icard[]>(`${environment.apiUrl}/api/cards`,
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
    }

    public deleteCard(cardId: number | undefined): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/api/cards/${cardId}`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }
}
