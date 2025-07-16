import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme } from '../services/theme';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Cover Letter Generator</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">Create professional cover letters instantly</p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <button
              (click)="theme.toggleTheme()"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              [attr.aria-label]="theme.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
            >
            @if(theme.isDarkMode()) {
              <svg
                class="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
              }
            @else {
              <svg
                class="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            }
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  protected readonly theme = inject(Theme);
}
