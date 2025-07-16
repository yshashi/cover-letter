import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CoverLetter } from '../services/cover-letter';
import { CoverLetterData } from '../models/cover-letter';

@Component({
  selector: 'app-form-editor',
  imports: [ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <h3 class="form-label text-lg font-semibold">Edit Your Information</h3>

      <form [formGroup]="form" class="space-y-4">
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900 dark:text-gray-100">Personal Information</h4>

          <div>
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
              <div class="text-red-500 text-sm mt-1">
                Full name is required
              </div>
            }
          </div>

          <div>
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
              <div class="text-red-500 text-sm mt-1">
                Please enter a valid email address
              </div>
            }
          </div>

          <div>
            <label class="form-label" for="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              formControlName="phone"
              class="form-input"
              [class.border-red-500]="isFieldInvalid('phone')"
              placeholder="(555) 123-4567"
            >
            @if(isFieldInvalid('phone')) {
              <div class="text-red-500 text-sm mt-1">
                Phone number is required
              </div>
            }
          </div>

          <div>
            <label class="form-label" for="address">Address</label>
            <input
              id="address"
              type="text"
              formControlName="address"
              class="form-input"
              placeholder="Your address"
            >
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="font-medium text-gray-900 dark:text-gray-100">Job Information</h4>

          <div>
            <label class="form-label" for="jobTitle">Job Title *</label>
            <input
              id="jobTitle"
              type="text"
              formControlName="jobTitle"
              class="form-input"
              [class.border-red-500]="isFieldInvalid('jobTitle')"
              placeholder="Position you're applying for"
            >
            @if(isFieldInvalid('jobTitle')) {
              <div class="text-red-500 text-sm mt-1">
                Job title is required
              </div>
            }
          </div>

          <div>
            <label class="form-label" for="companyName">Company Name *</label>
            <input
              id="companyName"
              type="text"
              formControlName="companyName"
              class="form-input"
              [class.border-red-500]="isFieldInvalid('companyName')"
              placeholder="Company you're applying to"
            >
            @if(isFieldInvalid('companyName')) {
              <div class="text-red-500 text-sm mt-1">
                Company name is required
              </div>
            }
          </div>

          <div>
            <label class="form-label" for="hiringManager">Hiring Manager</label>
            <input
              id="hiringManager"
              type="text"
              formControlName="hiringManager"
              class="form-input"
              placeholder="Mr./Ms. Last Name or 'Hiring Manager'"
            >
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-medium text-gray-900 dark:text-gray-100">Skills</h4>
            <button
              type="button"
              (click)="addSkill()"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              + Add Skill
            </button>
          </div>

          <div formArrayName="skills" class="space-y-2">
            @for(skillControl of skillsArray.controls; track $index) {
              <div
                class="flex items-center space-x-2"
              >
                <input
                type="text"
                [formControlName]="$index"
                class="form-input flex-1"
                placeholder="Enter a skill"
              >
              <button
                type="button"
                (click)="removeSkill($index)"
                class="text-red-500 hover:text-red-600 px-2 py-1"
                [attr.aria-label]="'Remove skill ' + ($index + 1)"
              >
                ×
              </button>
            </div>
            }
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-4">
          <h4 class="font-medium text-gray-900 dark:text-gray-100">Content</h4>

          <div>
            <label class="form-label" for="introduction">Introduction Paragraph *</label>
            <textarea
              id="introduction"
              formControlName="introduction"
              class="form-textarea"
              [class.border-red-500]="isFieldInvalid('introduction')"
              placeholder="Write your opening paragraph..."
              rows="4"
            ></textarea>
            @if(isFieldInvalid('introduction')) {
              <div class="text-red-500 text-sm mt-1">
                Introduction is required
              </div>
            }
          </div>

          <div>
            <label class="form-label" for="experience">Experience & Achievements</label>
            <textarea
              id="experience"
              formControlName="experience"
              class="form-textarea"
              placeholder="Describe your relevant experience and achievements..."
              rows="4"
            ></textarea>
          </div>

          <div>
            <label class="form-label" for="closing">Closing Statement</label>
            <textarea
              id="closing"
              formControlName="closing"
              class="form-textarea"
              placeholder="Write your closing paragraph..."
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            (click)="resetForm()"
            class="btn-secondary w-full"
          >
            Reset to Template Default
          </button>
        </div>
      </form>
    </div>
  `
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
