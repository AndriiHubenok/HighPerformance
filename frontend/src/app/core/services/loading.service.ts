import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _requestCount = signal(0);

  readonly isLoading = computed(() => this._requestCount() > 0);

  show(): void {
    this._requestCount.update(count => count + 1);
  }

  hide(): void {
    this._requestCount.update(count => Math.max(0, count - 1));
  }

  reset(): void {
    this._requestCount.set(0);
  }
}

