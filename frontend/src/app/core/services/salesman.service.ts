import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { Salesman, SalesmanInput } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SalesmanService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/salesmen';

  private cache = new Map<string, Observable<Salesman[]>>();

  getSalesmen(sid?: number, year?: number): Observable<Salesman[]> {
    const cacheKey = `salesmen-${sid}-${year}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    let params = new HttpParams();
    if (sid) params = params.set('sid', sid.toString());
    if (year) params = params.set('year', year.toString());

    const request$ = this.http.get<Salesman[]>(this.baseUrl, { params }).pipe(
      shareReplay(1)
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  getSalesmanById(sid: number): Observable<Salesman> {
    return this.http.get<Salesman>(`${this.baseUrl}/${sid}`);
  }

  createSalesman(salesman: SalesmanInput): Observable<Salesman> {
    return this.http.post<Salesman>(this.baseUrl, salesman).pipe(
      tap(() => this.clearCache())
    );
  }

  updateSalesman(sid: number, salesman: Partial<SalesmanInput>): Observable<Salesman> {
    return this.http.put<Salesman>(`${this.baseUrl}/${sid}`, salesman).pipe(
      tap(() => this.clearCache())
    );
  }

  deleteSalesman(sid: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${sid}`).pipe(
      tap(() => this.clearCache())
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
