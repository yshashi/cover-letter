import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { CoverLetter } from '../services/cover-letter';
import { CoverLetterTemplate } from '../models/cover-letter';

@Component({
  selector: 'app-template-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-fade-in">
      <h3 class="section-title">Choose Template</h3>
      <div class="grid grid-cols-1 gap-4">
        @for (template of templates; track template.id) {
          <div
            class="p-5 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-md"
            [class]="
              isTemplateSelected(template.id)
                ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                : 'border-stone-200 dark:border-stone-700'
            "
            (click)="selectTemplate(template.id)"
          >
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <h4
                  class="font-semibold text-lg"
                  [class]="
                    isTemplateSelected(template.id)
                      ? 'text-accent-700 dark:text-accent-400'
                      : 'text-stone-900 dark:text-stone-100'
                  "
                >
                  {{ template.name }}
                </h4>
                <p class="mt-1 text-sm text-stone-600 dark:text-stone-400">
                  {{ template.description }}
                </p>
              </div>
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                [class]="
                  isTemplateSelected(template.id)
                    ? 'border-accent-500 bg-accent-500'
                    : 'border-stone-300 dark:border-stone-600'
                "
              >
                @if (isTemplateSelected(template.id)) {
                  <div class="w-2 h-2 bg-white rounded-full"></div>
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
  private readonly coverLetter = inject(CoverLetter);

  templates: CoverLetterTemplate[] = [];

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
