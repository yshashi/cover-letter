import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Theme } from '../services/theme';
import { CoverLetter } from '../services/cover-letter';

@Component({
  selector: 'app-header',
  template: `
    <header
      class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b shadow-sm border-gray-200 dark:border-gray-800"
      style="will-change: transform;"
    >
      <div class="px-4 mx-auto sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3 animate-slide-in-right">
            <div
              class="flex justify-center items-center w-10 h-10 bg-gradient-to-br rounded-xl transition-all duration-500 transform from-primary-500 to-secondary-500 dark:from-primary-600 dark:to-secondary-600 shadow-glow hover:shadow-glow-secondary animate-pulse-slow hover:scale-105"
            >
              <svg
                class="w-6 h-6 text-white drop-shadow-md"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
            <div>
              <h1
                class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 dark:from-primary-400 dark:via-secondary-400 dark:to-accent-400 animate-gradient"
              >
                Cover Letter Generator
              </h1>
              <p
                class="text-sm text-gray-600 dark:text-gray-400 animate-fade-in"
                style="animation-delay: 200ms"
              >
                Create professional cover letters instantly
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            @if (profileCount() > 0) {
            <div
              class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-lg border border-primary-200 dark:border-primary-800"
            >
              <svg
                class="w-4 h-4 text-primary-600 dark:text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                ></path>
              </svg>
              <span
                class="text-sm font-medium text-primary-700 dark:text-primary-300"
              >
                {{ profileCount() }}
                {{ profileCount() === 1 ? 'Profile' : 'Profiles' }}
              </span>
            </div>
            }

            <button
              (click)="theme.toggleTheme()"
              class="p-2 rounded-lg border border-gray-100 shadow-sm transition-all duration-300 bg-white/90 dark:bg-gray-800/90 hover:bg-gradient-to-br hover:from-primary-50 hover:to-secondary-50 dark:hover:from-gray-700 dark:hover:to-gray-700 hover:shadow-md dark:border-gray-700"
              [attr.aria-label]="
                theme.isDarkMode()
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              "
            >
              @if(theme.isDarkMode()) {
              <svg
                class="w-5 h-5 transition-colors duration-300 text-secondary-400 hover:text-secondary-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                ></path>
              </svg>
              } @else {
              <svg
                class="w-5 h-5 transition-colors duration-300 text-primary-500 hover:text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
              }
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly theme = inject(Theme);
  private readonly coverLetter = inject(CoverLetter);

  protected profileCount = computed(
    () => this.coverLetter.getAllProfiles().length
  );
}
