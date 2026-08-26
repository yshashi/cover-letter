import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { form, FormField, required, email } from '@angular/forms/signals';
import { PersonalInfoService } from '../services/personal-info';

@Component({
  selector: 'app-personal-info-editor',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-5 animate-fade-in">
      <div>
        <h3 class="section-title">Personal Info</h3>
        <p class="-mt-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
          Set this once — it's applied to every template and saved letter
          automatically.
        </p>
      </div>

      <form class="space-y-5" (submit)="$event.preventDefault()">
        <div>
          <label class="form-label" for="fullName">Full Name *</label>
          <input
            id="fullName"
            type="text"
            [formField]="personalForm.fullName"
            class="form-input"
            [class.border-red-500]="
              personalForm.fullName().touched() &&
              personalForm.fullName().invalid()
            "
            placeholder="Enter your full name"
          />
          @if (
            personalForm.fullName().touched() &&
            personalForm.fullName().errors().length
          ) {
            <div class="mt-1 text-sm text-red-500">
              {{ personalForm.fullName().errors()[0].message }}
            </div>
          }
        </div>

        <div>
          <label class="form-label" for="email">Email *</label>
          <input
            id="email"
            type="email"
            [formField]="personalForm.email"
            class="form-input"
            [class.border-red-500]="
              personalForm.email().touched() && personalForm.email().invalid()
            "
            placeholder="your.email@example.com"
          />
          @if (
            personalForm.email().touched() &&
            personalForm.email().errors().length
          ) {
            <div class="mt-1 text-sm text-red-500">
              {{ personalForm.email().errors()[0].message }}
            </div>
          }
        </div>

        <div>
          <label class="form-label" for="phone">Phone *</label>
          <input
            id="phone"
            type="tel"
            [formField]="personalForm.phone"
            class="form-input"
            [class.border-red-500]="
              personalForm.phone().touched() && personalForm.phone().invalid()
            "
            placeholder="(555) 123-4567"
          />
          @if (
            personalForm.phone().touched() &&
            personalForm.phone().errors().length
          ) {
            <div class="mt-1 text-sm text-red-500">
              {{ personalForm.phone().errors()[0].message }}
            </div>
          }
        </div>

        <div>
          <label class="form-label" for="address">Address</label>
          <input
            id="address"
            type="text"
            [formField]="personalForm.address"
            class="form-input"
            placeholder="Your address"
          />
        </div>
      </form>
    </div>
  `,
})
export class PersonalInfoEditor {
  private readonly personalInfoService = inject(PersonalInfoService);

  protected readonly model = signal(this.personalInfoService.data());

  protected readonly personalForm = form(this.model, (schemaPath) => {
    required(schemaPath.fullName, { message: 'Full name is required' });
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Please enter a valid email address' });
    required(schemaPath.phone, { message: 'Phone number is required' });
  });

  constructor() {
    effect(() => {
      this.personalInfoService.update(this.model());
    });
  }
}
