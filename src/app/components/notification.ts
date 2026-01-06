import { Component, inject } from '@angular/core';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-notification',
  standalone: true,
  template: `
    <div class="fixed top-20 right-4 z-[100] space-y-2 animate-fade-in">
      @for (notification of notificationService.notifications$(); track
      notification.id) {
      <div
        class="flex items-start gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-300 animate-slide-in-right min-w-[300px] max-w-md"
        [class]="getNotificationClasses(notification.type)"
      >
        <div class="flex-shrink-0 mt-0.5">
          @switch (notification.type) { @case ('success') {
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          } @case ('error') {
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          } @case ('warning') {
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          } @case ('info') {
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          } }
        </div>

        <div class="flex-1 text-sm font-medium">
          {{ notification.message }}
        </div>

        <button
          (click)="notificationService.remove(notification.id)"
          class="flex-shrink-0 ml-2 transition-opacity hover:opacity-70"
          aria-label="Close notification"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      }
    </div>
  `,
})
export class NotificationComponent {
  protected readonly notificationService = inject(NotificationService);

  getNotificationClasses(type: string): string {
    const baseClasses = 'bg-white/95 dark:bg-gray-800/95';

    switch (type) {
      case 'success':
        return `${baseClasses} border-green-500 text-green-700 dark:text-green-400`;
      case 'error':
        return `${baseClasses} border-red-500 text-red-700 dark:text-red-400`;
      case 'warning':
        return `${baseClasses} border-yellow-500 text-yellow-700 dark:text-yellow-400`;
      case 'info':
        return `${baseClasses} border-blue-500 text-blue-700 dark:text-blue-400`;
      default:
        return `${baseClasses} border-gray-500 text-gray-700 dark:text-gray-400`;
    }
  }
}
