import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { SocialPerformance, SocialPerformanceInput } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SocialPerformanceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/social-performance';

  private cache = new Map<string, Observable<SocialPerformance[]>>();

  getByaSalesmanId(sid: number): Observable<SocialPerformance[]> {
    const cacheKey = `social-${sid}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const request$ = this.http.get<SocialPerformance[]>(`${this.baseUrl}/${sid}`).pipe(
      shareReplay(1)
    );

    this.cache.set(cacheKey, request$);
    return request$;
  }

  create(performance: SocialPerformanceInput): Observable<SocialPerformance> {
    return this.http.post<SocialPerformance>(this.baseUrl, performance).pipe(
      tap(() => this.clearCache())
    );
  }

  update(id: string, performance: Partial<SocialPerformanceInput>): Observable<SocialPerformance> {
    return this.http.put<SocialPerformance>(`${this.baseUrl}/${id}`, performance).pipe(
      tap(() => this.clearCache())
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

