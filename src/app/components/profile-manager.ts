import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoverLetter } from '../services/cover-letter';
import { NotificationService } from '../services/notification';
import { SavedProfile } from '../services/storage';

@Component({
  selector: 'app-profile-manager',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="space-y-4 animate-fade-in">
      <div class="flex justify-between items-center">
        <h3
          class="inline-block text-transparent bg-clip-text section-title bg-gradient-primary-to-secondary"
        >
          Saved Profiles
        </h3>
        <button
          (click)="toggleSaveDialog()"
          class="flex items-center space-x-2 btn-primary text-sm"
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
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            ></path>
          </svg>
          <span>Save Current</span>
        </button>
      </div>

      @if (showSaveDialog()) {
      <div
        class="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 animate-slide-in-up"
      >
        <label
          class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Profile Name
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            [(ngModel)]="newProfileName"
            (keyup.enter)="saveProfile()"
            class="flex-1 form-input"
            placeholder="e.g., Software Developer Profile"
            autofocus
          />
          <button
            (click)="saveProfile()"
            class="btn-primary"
            [disabled]="!newProfileName().trim()"
          >
            Save
          </button>
          <button (click)="toggleSaveDialog()" class="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
      }

      <div class="space-y-3">
        @if (profiles().length === 0) {
        <div
          class="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700"
        >
          <svg
            class="w-12 h-12 mx-auto mb-3 text-gray-400"
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
          <p class="text-sm font-medium">No saved profiles yet</p>
          <p class="mt-1 text-xs">
            Save your current data to quickly switch between different profiles
          </p>
        </div>
        } @else { @for (profile of profiles(); track profile.id) {
        <div
          class="p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-md group"
          [class]="
            isCurrentProfile(profile.id)
              ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
          "
          (click)="loadProfile(profile.id)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h4 class="font-semibold text-gray-900 dark:text-gray-100">
                  {{ profile.name }}
                </h4>
                @if (isCurrentProfile(profile.id)) {
                <span
                  class="px-2 py-0.5 text-xs font-medium text-primary-700 bg-primary-100 dark:bg-primary-900/50 dark:text-primary-300 rounded-full"
                >
                  Active
                </span>
                }
              </div>
              <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                <div>
                  {{ profile.data.fullName || 'No name' }} •
                  {{ profile.data.jobTitle || 'No title' }}
                </div>
                <div class="mt-0.5">
                  Updated: {{ formatDate(profile.updatedAt) }}
                </div>
              </div>
            </div>

            <button
              (click)="deleteProfile(profile.id, $event)"
              class="p-2 text-red-500 bg-red-50 dark:bg-red-900/30 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/50"
              aria-label="Delete profile"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        } }
      </div>

      @if (profiles().length > 0) {
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
          <svg
            class="inline w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          Your data is automatically saved as you type
        </p>
      </div>
      }
    </div>
  `,
})
export class ProfileManagerComponent {
  private coverLetter = inject(CoverLetter);
  private notification = inject(NotificationService);

  protected profiles = signal<SavedProfile[]>([]);
  protected showSaveDialog = signal(false);
  protected newProfileName = signal('');

  constructor() {
    this.loadProfiles();
  }

  private loadProfiles(): void {
    this.profiles.set(this.coverLetter.getAllProfiles());
  }

  toggleSaveDialog(): void {
    this.showSaveDialog.update((v) => !v);
    if (this.showSaveDialog()) {
      this.newProfileName.set('');
    }
  }

  saveProfile(): void {
    const name = this.newProfileName().trim();
    if (!name) {
      this.notification.warning('Please enter a profile name');
      return;
    }

    try {
      this.coverLetter.saveCurrentProfile(name);
      this.loadProfiles();
      this.notification.success(`Profile "${name}" saved successfully!`);
      this.showSaveDialog.set(false);
      this.newProfileName.set('');
    } catch (error) {
      this.notification.error('Failed to save profile');
      console.error('Error saving profile:', error);
    }
  }

  loadProfile(id: string): void {
    try {
      this.coverLetter.loadProfile(id);
      const profile = this.profiles().find((p) => p.id === id);
      if (profile) {
        this.notification.success(`Loaded profile: ${profile.name}`);
      }
    } catch (error) {
      this.notification.error('Failed to load profile');
      console.error('Error loading profile:', error);
    }
  }

  deleteProfile(id: string, event: Event): void {
    event.stopPropagation();

    const profile = this.profiles().find((p) => p.id === id);
    if (!profile) return;

    if (confirm(`Are you sure you want to delete "${profile.name}"?`)) {
      try {
        this.coverLetter.deleteProfile(id);
        this.loadProfiles();
        this.notification.success('Profile deleted successfully');
      } catch (error) {
        this.notification.error('Failed to delete profile');
        console.error('Error deleting profile:', error);
      }
    }
  }

  isCurrentProfile(id: string): boolean {
    return this.coverLetter.getCurrentProfileId() === id;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  }
}
