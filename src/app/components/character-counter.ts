import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-character-counter',
  standalone: true,
  template: `
    <div class="flex justify-between items-center mt-1 text-xs">
      <span class="text-gray-500 dark:text-gray-400">
        {{ label }}
      </span>
      <span class="font-medium transition-colors" [class]="getColorClass()">
        {{ current }} / {{ max }}
      </span>
    </div>
  `,
})
export class CharacterCounterComponent {
  @Input() current: number = 0;
  @Input() max: number = 500;
  @Input() label: string = 'Characters';

  getColorClass(): string {
    const percentage = (this.current / this.max) * 100;

    if (percentage >= 100) {
      return 'text-red-600 dark:text-red-400';
    } else if (percentage >= 90) {
      return 'text-yellow-600 dark:text-yellow-400';
    } else if (percentage >= 75) {
      return 'text-blue-600 dark:text-blue-400';
    } else {
      return 'text-gray-600 dark:text-gray-400';
    }
  }
}
