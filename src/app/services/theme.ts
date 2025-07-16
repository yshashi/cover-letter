import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  private _isDarkMode = signal<boolean>(false);

  isDarkMode = this._isDarkMode.asReadonly();

  constructor() {
    this.initializeTheme();
    effect(() => {
      this.applyTheme(this._isDarkMode());
    });
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('lp_coverletter_theme');
    if (savedTheme) {
      this._isDarkMode.set(savedTheme === 'dark');
    } else {
      this._isDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }

  private applyTheme(isDark: boolean): void {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    localStorage.setItem('lp_coverletter_theme', isDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    this._isDarkMode.update(current => !current);
  }
}
