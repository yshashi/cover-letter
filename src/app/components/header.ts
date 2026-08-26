import {
  Component,
  inject,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Theme } from '../services/theme';
import { CoverLetter } from '../services/cover-letter';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-50 bg-white dark:bg-stone-900 border-b shadow-sm border-stone-200 dark:border-stone-800"
      style="will-change: transform;"
    >
      <div class="px-4 mx-auto sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <div
              class="flex justify-center items-center w-10 h-10 bg-accent-600 rounded-xl"
            >
              <svg
                class="w-6 h-6 text-white"
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
              <h1 class="text-xl font-bold text-stone-900 dark:text-white">
                Cover Letter Generator
              </h1>
              <p class="text-sm text-stone-600 dark:text-stone-400">
                Create professional cover letters instantly
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            @if (profileCount() > 0) {
              <div
                class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent-50 dark:bg-accent-900/30 rounded-lg border border-accent-200 dark:border-accent-800"
              >
                <svg
                  class="w-4 h-4 text-accent-600 dark:text-accent-400"
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
                  class="text-sm font-medium text-accent-700 dark:text-accent-300"
                >
                  {{ profileCount() }}
                  {{ profileCount() === 1 ? 'Profile' : 'Profiles' }}
                </span>
              </div>
            }

            <button
              (click)="theme.toggleTheme()"
              class="p-2 rounded-lg border border-stone-200 shadow-sm transition-all duration-300 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 hover:shadow-md dark:border-stone-700"
              [attr.aria-label]="
                theme.isDarkMode()
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              "
            >
              @if (theme.isDarkMode()) {
                <svg
                  class="w-5 h-5 text-stone-300"
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
                  class="w-5 h-5 text-accent-600"
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
    () => this.coverLetter.getAllProfiles().length,
  );
}
