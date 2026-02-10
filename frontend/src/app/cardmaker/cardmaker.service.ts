import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CardService {
    private http = inject(HttpClient);

    public getCards(): Observable<any> {
        return this.http.get<any>(`http://localhost:4000/api/cards`);
    }
}
