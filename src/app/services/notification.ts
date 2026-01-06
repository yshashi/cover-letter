import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);

  readonly notifications$ = this.notifications.asReadonly();

  show(
    message: string,
    type: Notification['type'] = 'info',
    duration: number = 3000
  ): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      duration,
    };

    this.notifications.update((notifications) => [
      ...notifications,
      notification,
    ]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, duration);
    }
  }

  success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  remove(id: string): void {
    this.notifications.update((notifications) =>
      notifications.filter((n) => n.id !== id)
    );
  }

  private generateId(): string {
    return `notification_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }
}
