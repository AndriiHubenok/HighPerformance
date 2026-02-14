import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

export interface SystemNotification {
  _id: string;
  recipientRole: string;
  type: 'BONUS_REJECTED' | 'BONUS_APPROVED' | 'BONUS_PENDING' | 'INFO';
  title: string;
  message: string;
  relatedSalesmanId?: number;
  relatedYear?: number;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class SystemNotificationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/bonus/notifications';

  private readonly _notifications = signal<SystemNotification[]>([]);
  private readonly _unreadCount = signal<number>(0);

  readonly notifications = computed(() => this._notifications());
  readonly unreadCount = computed(() => this._unreadCount());

  getNotifications(): Observable<SystemNotification[]> {
    return this.http.get<SystemNotification[]>(this.baseUrl);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/unread-count`);
  }

  markAsRead(id: string): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.baseUrl}/${id}/read`, {});
  }

  markAllAsRead(): Observable<{ success: boolean }> {
    return this.http.put<{ success: boolean }>(`${this.baseUrl}/mark-all-read`, {});
  }

  loadNotifications(): void {
    this.getNotifications().subscribe({
      next: (notifications) => this._notifications.set(notifications)
    });
  }

  loadUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: (result) => this._unreadCount.set(result.count)
    });
  }

  // Start polling for notifications every 30 seconds
  startPolling(): void {
    interval(30000).pipe(
      startWith(0),
      switchMap(() => this.getUnreadCount())
    ).subscribe({
      next: (result) => this._unreadCount.set(result.count)
    });
  }

  markNotificationAsRead(id: string): void {
    this.markAsRead(id).subscribe({
      next: () => {
        this._notifications.update(notifications =>
          notifications.map(n => n._id === id ? { ...n, isRead: true } : n)
        );
        this._unreadCount.update(count => Math.max(0, count - 1));
      }
    });
  }

  markAllNotificationsAsRead(): void {
    this.markAllAsRead().subscribe({
      next: () => {
        this._notifications.update(notifications =>
          notifications.map(n => ({ ...n, isRead: true }))
        );
        this._unreadCount.set(0);
      }
    });
  }

  // Delete methods
  deleteNotification(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.baseUrl}/${id}`);
  }

  deleteAllNotifications(): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(this.baseUrl);
  }

  removeNotification(id: string): void {
    this.deleteNotification(id).subscribe({
      next: () => {
        const notification = this._notifications().find(n => n._id === id);
        this._notifications.update(notifications =>
          notifications.filter(n => n._id !== id)
        );
        if (notification && !notification.isRead) {
          this._unreadCount.update(count => Math.max(0, count - 1));
        }
      }
    });
  }

  clearAllNotifications(): void {
    this.deleteAllNotifications().subscribe({
      next: () => {
        this._notifications.set([]);
        this._unreadCount.set(0);
      }
    });
  }
}

