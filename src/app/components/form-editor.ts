import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { CoverLetter } from '../services/cover-letter';

@Component({
  selector: 'app-form-editor',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 animate-fade-in">
      <h3 class="section-title">Edit Your Information</h3>

      <form class="space-y-5" (submit)="$event.preventDefault()">
        <div class="space-y-5">
          <h4 class="font-medium text-stone-500 dark:text-stone-400">
            Job Information
          </h4>

          <div class="animate-slide-in-right" style="animation-delay: 350ms">
            <label for="jobTitle" class="form-label">Job Title *</label>
            <input
              type="text"
              id="jobTitle"
              [formField]="editorForm.jobTitle"
              class="form-input"
              [class.border-red-500]="
                editorForm.jobTitle().touched() &&
                editorForm.jobTitle().invalid()
              "
              placeholder="Position you're applying for"
            />
            @if (
              editorForm.jobTitle().touched() &&
              editorForm.jobTitle().errors().length
            ) {
              <div class="mt-1 text-sm text-red-500">
                {{ editorForm.jobTitle().errors()[0].message }}
              </div>
            }
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 400ms">
            <label for="companyName" class="form-label">Company Name *</label>
            <input
              type="text"
              id="companyName"
              [formField]="editorForm.companyName"
              class="form-input"
              [class.border-red-500]="
                editorForm.companyName().touched() &&
                editorForm.companyName().invalid()
              "
              placeholder="Company you're applying to"
            />
            @if (
              editorForm.companyName().touched() &&
              editorForm.companyName().errors().length
            ) {
              <div class="mt-1 text-sm text-red-500">
                {{ editorForm.companyName().errors()[0].message }}
              </div>
            }
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 450ms">
            <label for="hiringManager" class="form-label">Hiring Manager</label>
            <input
              type="text"
              id="hiringManager"
              [formField]="editorForm.hiringManager"
              class="form-input"
              placeholder="Mr./Ms. Last Name or 'Hiring Manager'"
            />
          </div>

          <h4
            class="mt-8 font-medium text-stone-500 dark:text-stone-400"
            style="animation-delay: 500ms"
          >
            Content
          </h4>

          <div class="animate-slide-in-right" style="animation-delay: 550ms">
            <label for="introduction" class="form-label"
              >Introduction Paragraph *</label
            >
            <p class="-mt-1 mb-2 text-xs text-stone-500 dark:text-stone-400">
              Insert a field below to keep it in sync if you edit it later:
            </p>
            <div class="flex flex-wrap gap-1.5 mb-2">
              @for (token of insertableTokens; track token.value) {
                <button
                  type="button"
                  class="chip"
                  (click)="
                    insertToken('introduction', token.value, introTextarea)
                  "
                >
                  {{ token.label }}
                </button>
              }
            </div>
            <textarea
              #introTextarea
              id="introduction"
              [formField]="editorForm.introduction"
              class="form-textarea"
              [class.border-red-500]="
                editorForm.introduction().touched() &&
                editorForm.introduction().invalid()
              "
              placeholder="Write your opening paragraph..."
              rows="4"
            ></textarea>
            @if (
              editorForm.introduction().touched() &&
              editorForm.introduction().errors().length
            ) {
              <div class="mt-1 text-sm text-red-500">
                {{ editorForm.introduction().errors()[0].message }}
              </div>
            }
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 600ms">
            <label for="experience" class="form-label"
              >Experience & Achievements</label
            >
            <div class="flex flex-wrap gap-1.5 mb-2">
              @for (token of insertableTokens; track token.value) {
                <button
                  type="button"
                  class="chip"
                  (click)="
                    insertToken('experience', token.value, experienceTextarea)
                  "
                >
                  {{ token.label }}
                </button>
              }
            </div>
            <textarea
              #experienceTextarea
              id="experience"
              [formField]="editorForm.experience"
              class="form-textarea"
              placeholder="Describe your relevant experience and achievements..."
              rows="6"
            ></textarea>
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 650ms">
            <label for="closing" class="form-label">Closing Statement</label>
            <div class="flex flex-wrap gap-1.5 mb-2">
              @for (token of insertableTokens; track token.value) {
                <button
                  type="button"
                  class="chip"
                  (click)="insertToken('closing', token.value, closingTextarea)"
                >
                  {{ token.label }}
                </button>
              }
            </div>
            <textarea
              #closingTextarea
              id="closing"
              [formField]="editorForm.closing"
              class="form-textarea"
              placeholder="Write your closing paragraph..."
              rows="3"
            ></textarea>
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 700ms">
            <div class="flex justify-between items-center">
              <label class="mb-0 form-label">Skills</label>
              <button
                type="button"
                class="flex items-center text-sm font-medium text-accent-600 hover:text-accent-700"
                (click)="addSkill()"
              >
                <svg
                  class="mr-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Skill
              </button>
            </div>
            <div class="mt-3 space-y-3">
              @for (skill of editorForm.skills; track $index; let i = $index) {
                <div class="flex items-center space-x-2">
                  <input
                    [formField]="skill"
                    class="flex-1 form-input"
                    placeholder="Enter a skill"
                  />
                  <button
                    type="button"
                    class="p-2 text-red-500 bg-gradient-to-r from-red-50 to-red-100 rounded-lg transition-all duration-300 hover:shadow-sm dark:from-red-900/30 dark:to-red-800/30 dark:text-red-400 dark:hover:from-red-900/40 dark:hover:to-red-800/40"
                    (click)="removeSkill(i)"
                    aria-label="Remove skill"
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
          </div>

          <div class="pt-4 border-t border-stone-200 dark:border-stone-700">
            <button
              type="button"
              (click)="resetForm()"
              class="w-full btn-secondary"
            >
              Reset to Template Default
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
})
export class FormEditor {
  private readonly coverLetterService = inject(CoverLetter);

  // Inserted as {{token}} into free-text fields; CoverLetter.compiledContent resolves
  // them live so editing Personal Info / Job Info never requires retyping the content.
  protected readonly insertableTokens = [
    { label: 'Your Name', value: '{{fullName}}' },
    { label: 'Job Title', value: '{{jobTitle}}' },
    { label: 'Company', value: '{{companyName}}' },
    { label: 'Hiring Manager', value: '{{hiringManager}}' },
  ];

  protected readonly model = signal(this.coverLetterService.jobData());

  protected readonly editorForm = form(this.model, (schemaPath) => {
    required(schemaPath.jobTitle, { message: 'Job title is required' });
    required(schemaPath.companyName, { message: 'Company name is required' });
    required(schemaPath.introduction, { message: 'Introduction is required' });
  });

  constructor() {
    // Push every model change back into the shared signal store (autosaved by CoverLetter).
    effect(() => {
      const data = this.model();
      this.coverLetterService.updateJobData({
        ...data,
        skills: data.skills.filter((skill) => skill.trim() !== ''),
        date: new Date().toLocaleDateString(),
      });
    });
  }

  addSkill(): void {
    this.model.update((current) => ({
      ...current,
      skills: [...current.skills, ''],
    }));
  }

  removeSkill(index: number): void {
    this.model.update((current) => ({
      ...current,
      skills: current.skills.filter((_, i) => i !== index),
    }));
  }

  resetForm(): void {
    const currentTemplate = this.coverLetterService.selectedTemplate();
    if (currentTemplate) {
      this.model.set({ ...currentTemplate.sampleData });
    }
  }

  insertToken(
    field: 'introduction' | 'experience' | 'closing',
    token: string,
    textarea: HTMLTextAreaElement,
  ): void {
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    const current = this.model()[field];
    const updated = current.slice(0, start) + token + current.slice(end);

    this.model.update((m) => ({ ...m, [field]: updated }));

    queueMicrotask(() => {
      textarea.focus();
      const caret = start + token.length;
      textarea.setSelectionRange(caret, caret);
    });
  }
}
