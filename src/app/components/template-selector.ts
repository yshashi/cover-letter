import { Component, OnInit } from '@angular/core';
import { CoverLetter } from '../services/cover-letter';
import { CoverLetterTemplate } from '../models/cover-letter';

@Component({
  selector: 'app-template-selector',
  template: `
    <div class="space-y-6">
      <div>
        <h3 class="form-label text-lg font-semibold mb-3">Choose Template</h3>
        <div class="grid grid-cols-1 gap-4">
          @for (template of templates; track template.id) {
          <div
            class="p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
            [class.border-primary-500]="isTemplateSelected(template.id)"
            [class.bg-primary-50]="isTemplateSelected(template.id)"
            [class.dark:bg-primary-950]="isTemplateSelected(template.id)"
            [class.border-gray-200]="!isTemplateSelected(template.id)"
            [class.dark:border-gray-700]="!isTemplateSelected(template.id)"
            (click)="selectTemplate(template.id)"
          >
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ template.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ template.description }}</p>
              </div>
              <div
                class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                [class.border-primary-500]="isTemplateSelected(template.id)"
                [class.bg-primary-500]="isTemplateSelected(template.id)"
                [class.border-gray-300]="!isTemplateSelected(template.id)"
                [class.dark:border-gray-600]="!isTemplateSelected(template.id)"
              >
              @if ( isTemplateSelected(template.id)) {
                <div
                  class="w-2 h-2 rounded-full bg-white"
                ></div>
              }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class TemplateSelectorComponent implements OnInit {
  templates: CoverLetterTemplate[] = [];

  constructor(private coverLetter: CoverLetter) { }

  ngOnInit(): void {
    this.templates = this.coverLetter.getTemplates();
    this.selectTemplate(this.templates[0].id);
  }

  selectTemplate(templateId: string): void {
    this.coverLetter.selectTemplate(templateId);
  }

  isTemplateSelected(templateId: string): boolean {
    return this.coverLetter.selectedTemplate()?.id === templateId;
  }
}
