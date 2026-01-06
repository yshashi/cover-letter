import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoverLetter } from '../services/cover-letter';
import { CoverLetterTemplate } from '../models/cover-letter';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <h3
        class="inline-block text-transparent bg-clip-text section-title bg-gradient-primary-to-secondary"
      >
        Choose Template
      </h3>
      <div class="grid grid-cols-1 gap-4">
        @for (template of templates; track template.id; let i = $index) {
        <div
          class="p-5 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-md animate-fade-in"
          [style.animation-delay]="i * 100 + 'ms'"
          [ngClass]="{
            'border-primary-500 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20':
              isTemplateSelected(template.id),
            'border-gray-200 dark:border-gray-700': !isTemplateSelected(
              template.id
            )
          }"
          (click)="selectTemplate(template.id)"
        >
          <div class="flex justify-between items-center">
            <div class="flex-1">
              <h4
                class="font-semibold text-lg"
                [ngClass]="{
                  'text-transparent bg-clip-text bg-gradient-primary-to-secondary':
                    isTemplateSelected(template.id),
                  'text-gray-900 dark:text-gray-100': !isTemplateSelected(
                    template.id
                  )
                }"
              >
                {{ template.name }}
              </h4>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ template.description }}
              </p>
            </div>
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
              [ngClass]="{
                'border-primary-500 bg-gradient-primary-to-secondary shadow-glow':
                  isTemplateSelected(template.id),
                'border-gray-300 dark:border-gray-600': !isTemplateSelected(
                  template.id
                )
              }"
            >
              @if (isTemplateSelected(template.id)) {
              <div
                class="w-2 h-2 bg-white rounded-full animate-pulse-slow"
              ></div>
              }
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class TemplateSelectorComponent implements OnInit {
  templates: CoverLetterTemplate[] = [];

  constructor(private coverLetter: CoverLetter) {}

  ngOnInit(): void {
    this.templates = this.coverLetter.getTemplates();

    // Only select default template if no template is currently selected
    if (!this.coverLetter.selectedTemplate()) {
      this.selectTemplate(this.templates[0].id);
    }
  }

  selectTemplate(templateId: string): void {
    this.coverLetter.selectTemplate(templateId);
  }

  isTemplateSelected(templateId: string): boolean {
    return this.coverLetter.selectedTemplate()?.id === templateId;
  }
}
