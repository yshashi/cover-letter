import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CoverLetter } from '../services/cover-letter';
import { CoverLetterData } from '../models/cover-letter';

@Component({
  selector: 'app-form-editor',
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <h3 class="inline-block text-transparent bg-clip-text section-title bg-gradient-primary-to-secondary">Edit Your Information</h3>

      <form [formGroup]="form" class="space-y-5">
        <div class="space-y-5">
          <h4 class="font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400">Personal Information</h4>

          <div class="animate-slide-in-right" style="animation-delay: 100ms">
            <label class="form-label" for="fullName">Full Name *</label>
            <input
              id="fullName"
              type="text"
              formControlName="fullName"
              class="form-input"
              [class.border-red-500]="isFieldInvalid('fullName')"
              placeholder="Enter your full name"
            >
            @if(isFieldInvalid('fullName')) {
              <div class="mt-1 text-sm text-red-500">
                Full name is required
              </div>
            }
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 150ms">
            <label class="form-label" for="email">Email *</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-input"
              [class.border-red-500]="isFieldInvalid('email')"
              placeholder="your.email@example.com"
            >
            @if(isFieldInvalid('email')) {
              <div class="mt-1 text-sm text-red-500">
                Please enter a valid email address
              </div>
            }
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 200ms">
            <label class="form-label" for="phone">Phone *</label>
            <input
              id="phone"
              type="tel"
              formControlName="phone"
              class="form-input"
              [class.border-red-500]="isFieldInvalid('phone')"
              placeholder="(555) 123-4567"
            >
            @if(isFieldInvalid('phone')) {
              <div class="mt-1 text-sm text-red-500">
                Phone number is required
              </div>
            }
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 250ms">
            <label class="form-label" for="address">Address</label>
            <input
              id="address"
              type="text"
              formControlName="address"
              class="form-input"
              placeholder="Your address"
            >
          </div>

          <h4 class="mt-8 font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 animate-slide-in-right" style="animation-delay: 300ms">Job Information</h4>

          <div class="animate-slide-in-right" style="animation-delay: 350ms">
            <label for="jobTitle" class="form-label">Job Title *</label>
            <input
              type="text"
              id="jobTitle"
              formControlName="jobTitle"
              class="form-input"
              [class.border-red-500]="isFieldInvalid('jobTitle')"
              placeholder="Position you're applying for"
            />
            @if(isFieldInvalid('jobTitle')) {
              <div class="mt-1 text-sm text-red-500">
                Job title is required
              </div>
            }
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 400ms">
            <label for="companyName" class="form-label">Company Name *</label>
            <input
              type="text"
              id="companyName"
              formControlName="companyName"
              class="form-input"
              [class.border-red-500]="isFieldInvalid('companyName')"
              placeholder="Company you're applying to"
            />
            @if(isFieldInvalid('companyName')) {
              <div class="mt-1 text-sm text-red-500">
                Company name is required
              </div>
            }
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 450ms">
            <label for="hiringManager" class="form-label">Hiring Manager</label>
            <input
              type="text"
              id="hiringManager"
              formControlName="hiringManager"
              class="form-input"
              placeholder="Mr./Ms. Last Name or 'Hiring Manager'"
            />
          </div>

          <h4 class="mt-8 font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 animate-slide-in-right" style="animation-delay: 500ms">Content</h4>

          <div class="animate-slide-in-right" style="animation-delay: 550ms">
            <label for="introduction" class="form-label">Introduction Paragraph *</label>
            <textarea
              id="introduction"
              formControlName="introduction"
              class="form-textarea"
              [class.border-red-500]="isFieldInvalid('introduction')"
              placeholder="Write your opening paragraph..."
              rows="4"
            ></textarea>
            @if(isFieldInvalid('introduction')) {
              <div class="mt-1 text-sm text-red-500">
                Introduction is required
              </div>
            }
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 600ms">
            <label for="experience" class="form-label">Experience & Achievements</label>
            <textarea
              id="experience"
              formControlName="experience"
              class="form-textarea"
              placeholder="Describe your relevant experience and achievements..."
              rows="4"
            ></textarea>
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 650ms">
            <label for="closing" class="form-label">Closing Statement</label>
            <textarea
              id="closing"
              formControlName="closing"
              class="form-textarea"
              placeholder="Write your closing paragraph..."
              rows="3"
            ></textarea>
          </div>

          <div class="animate-slide-in-right" style="animation-delay: 700ms">
            <div class="flex justify-between items-center">
              <label for="skills" class="mb-0 form-label">Skills</label>
              <button
                type="button"
                class="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                (click)="addSkill()"
              >
                <svg class="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Skill
              </button>
            </div>
            <div formArrayName="skills" class="mt-3 space-y-3">
              @for(skillControl of skillsArray.controls; track $index) {
                <div class="flex items-center space-x-2">
                  <input
                    [formControlName]="$index"
                    class="flex-1 form-input"
                    placeholder="Enter a skill"
                  />
                  <button
                    type="button"
                    class="p-2 text-red-500 bg-gradient-to-r from-red-50 to-red-100 rounded-lg transition-all duration-300 hover:shadow-sm dark:from-red-900/30 dark:to-red-800/30 dark:text-red-400 dark:hover:from-red-900/40 dark:hover:to-red-800/40"
                    (click)="removeSkill($index)"
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

          <div class="pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide-in-right" style="animation-delay: 750ms">
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
export class FormEditor implements OnInit, OnDestroy {
  form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private coverLetterService: CoverLetter
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscription();
    this.loadFormData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: [''],
      jobTitle: ['', [Validators.required]],
      companyName: ['', [Validators.required]],
      hiringManager: [''],
      introduction: ['', [Validators.required]],
      experience: [''],
      closing: [''],
      skills: this.fb.array([])
    });
  }

  private setupFormSubscription(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const formData: CoverLetterData = {
          ...value,
          skills: value.skills.filter((skill: string) => skill.trim() !== ''),
          date: new Date().toLocaleDateString()
        };
        this.coverLetterService.updateFormData(formData);
      });
  }

  private loadFormData(): void {
    const currentData = this.coverLetterService.formData();
    if (currentData) {
      this.form.patchValue(currentData);
      this.setSkills(currentData.skills || []);
    }
  }

  get skillsArray(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  addSkill(): void {
    this.skillsArray.push(this.fb.control(''));
  }

  removeSkill(index: number): void {
    this.skillsArray.removeAt(index);
  }

  private setSkills(skills: string[]): void {
    const skillsArray = this.form.get('skills') as FormArray;
    skillsArray.clear();
    skills.forEach(skill => {
      skillsArray.push(this.fb.control(skill));
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  resetForm(): void {
    const currentTemplate = this.coverLetterService.selectedTemplate();
    if (currentTemplate) {
      this.form.patchValue(currentTemplate.sampleData);
      this.setSkills(currentTemplate.sampleData.skills || []);
    }
  }
}
