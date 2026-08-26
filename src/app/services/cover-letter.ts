import { Injectable, signal, computed, effect, inject } from '@angular/core';
import {
  CoverLetterData,
  CoverLetterTemplate,
  JobLetterData,
} from '../models/cover-letter';
import { StorageService } from './storage';
import { PersonalInfoService } from './personal-info';

// Shared across all built-in templates so switching templates never changes the letter's
// wording; {{jobTitle}}/{{companyName}} resolve live, so this stays accurate for any role.
const GENERIC_SAMPLE_DATA: JobLetterData = {
  jobTitle: 'Software Engineer',
  companyName: 'Company Name',
  hiringManager: 'Hiring Manager',
  introduction:
    'I am writing to express my interest in the {{jobTitle}} position at {{companyName}}. Based on the description of this role, I believe my background and experience make me a strong fit, and I am excited about the opportunity to contribute to your team.',
  skills: [
    'Communication',
    'Problem Solving',
    'Team Collaboration',
    'Adaptability',
    'Time Management',
  ],
  experience:
    'In my current role, I have consistently delivered results by taking ownership of important projects, collaborating closely with cross-functional teams, and focusing on outcomes that matter to the business. I have a track record of solving problems efficiently, improving processes, and supporting the growth of the people I work with.',
  closing:
    'I would welcome the opportunity to discuss how my experience and skills could contribute to {{companyName}}. Thank you for taking the time to consider my application, and I look forward to the possibility of speaking with you soon.',
  date: new Date().toLocaleDateString(),
};

@Injectable({
  providedIn: 'root',
})
export class CoverLetter {
  private storage = inject(StorageService);
  private personalInfo = inject(PersonalInfoService);

  #selectedTemplate = signal<CoverLetterTemplate | null>(null);
  #jobData = signal<JobLetterData>({
    jobTitle: '',
    companyName: '',
    hiringManager: '',
    introduction: '',
    skills: [],
    experience: '',
    closing: '',
    date: new Date().toLocaleDateString(),
  });

  selectedTemplate = this.#selectedTemplate.asReadonly();
  jobData = this.#jobData.asReadonly();

  // Personal info is a single global value; job info is per-letter. This merged view feeds compiledContent.
  formData = computed<CoverLetterData>(() => ({
    ...this.personalInfo.data(),
    ...this.#jobData(),
  }));

  private isInitialized = false;

  constructor() {
    this.loadAutoSavedData();
    this.isInitialized = true;

    effect(() => {
      if (this.isInitialized) {
        const data = this.#jobData();
        const templateId = this.#selectedTemplate()?.id;
        this.storage.autoSave(data, templateId);
      }
    });
  }

  private loadAutoSavedData(): void {
    const autoSaved = this.storage.getAutoSave();
    if (autoSaved) {
      this.#jobData.set(autoSaved.data);

      // Restore the selected template if saved; fall back to the first template
      // for ids that no longer exist (e.g. the removed 'modern') without
      // resetting the user's letter data.
      if (autoSaved.templateId) {
        const template =
          this.templates.find((t) => t.id === autoSaved.templateId) ??
          this.templates[0];
        this.#selectedTemplate.set(template);
      }
    }
  }

  private templates: CoverLetterTemplate[] = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'A classic, formal cover letter template',
      template: `
        <div class="space-y-6">
          <div class="text-sm text-right text-gray-600">
            {{date}}
          </div>

          <div class="space-y-1">
            <h1 class="text-2xl font-bold text-{{themeColor}}-700">{{fullName}}</h1>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              <div>{{email}} | {{phone}}</div>
              {{#if_has_address}}<div>{{address}}</div>{{/if_has_address}}
            </div>
          </div>

          <div class="space-y-2">
            <div class="font-medium">{{hiringManager}}</div>
            <div class="font-medium">{{companyName}}</div>
          </div>

          <div class="space-y-4">
            <p class="font-medium">Dear {{hiringManager}},</p>

            <p>{{introduction}}</p>

            {{#if_has_skills}}
            <div>
              <p class="mb-2">My key qualifications include:</p>
              <ul class="ml-4 space-y-1 list-disc list-inside">
                {{skillsList}}
              </ul>
            </div>
            {{/if_has_skills}}

            {{#if_has_experience}}<p>{{experience}}</p>{{/if_has_experience}}

            {{#if_has_closing}}<p>{{closing}}</p>{{/if_has_closing}}

            <div class="mt-6">
              <p>Sincerely,</p>
              <p class="mt-2 font-medium">{{fullName}}</p>
            </div>
          </div>
        </div>
      `,
      sampleData: GENERIC_SAMPLE_DATA,
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'A modern, creative template with visual appeal',
      template: `
        <div class="space-y-6 dark:text-gray-200">
          <div class="border-l-4 border-{{themeColor}}-500 pl-4">
            <h1 class="text-3xl font-bold text-{{themeColor}}-700">{{fullName}}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">Applying for {{jobTitle}}</p>
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{email}} | {{phone}}{{#if_has_address}} | {{address}}{{/if_has_address}}
            </div>
          </div>

          <div class="bg-{{themeColor}}-50 p-4 rounded-lg">
            <h2 class="text-lg font-semibold text-{{themeColor}}-800 mb-2">Dear {{hiringManager}},</h2>
            <p class="text-gray-700 dark:text-gray-400">{{introduction}}</p>
          </div>

          <div class="p-4">
            <h3 class="text-xl font-semibold text-{{themeColor}}-700 mb-3">Why I'm Perfect for {{companyName}}</h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              {{#if_has_skills}}
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-{{themeColor}}-200">
                <h4 class="font-medium text-{{themeColor}}-600 mb-2">Key Skills</h4>
                <ul class="space-y-1 text-sm">
                  {{skillsList}}
                </ul>
              </div>
              {{/if_has_skills}}
              {{#if_has_experience}}
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-{{themeColor}}-200">
                <h4 class="font-medium text-{{themeColor}}-600 mb-2">Experience</h4>
                <p class="text-sm text-gray-700 dark:text-gray-400">{{experience}}</p>
              </div>
              {{/if_has_experience}}
            </div>
          </div>

          {{#if_has_closing}}
          <div class="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
            <p class="text-gray-700 dark:text-gray-400">{{closing}}</p>
          </div>
          {{/if_has_closing}}

          <div class="text-right">
            <p class="text-sm text-gray-500">{{date}}</p>
            <p class="font-medium text-{{themeColor}}-700 mt-2">{{fullName}}</p>
          </div>
        </div>
      `,
      sampleData: GENERIC_SAMPLE_DATA,
    },
    {
      id: 'impact',
      name: 'Impact',
      description:
        'ATS-friendly, results-first layout recruiters scan in seconds',
      template: `
        <div class="space-y-6 dark:text-gray-200">
          <div class="flex flex-wrap gap-4 justify-between items-start pb-4 border-b-2 border-{{themeColor}}-600 break-inside-avoid">
            <div class="space-y-1">
              <h1 class="text-2xl font-bold text-{{themeColor}}-700">{{fullName}}</h1>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{email}} &bull; {{phone}}{{#if_has_address}} &bull; {{address}}{{/if_has_address}}</p>
            </div>
            <p class="text-sm text-right text-gray-500 whitespace-nowrap dark:text-gray-400">{{date}}</p>
          </div>

          <div class="p-4 bg-{{themeColor}}-50 rounded-lg break-inside-avoid dark:bg-gray-800">
            <p class="font-semibold text-{{themeColor}}-800 dark:text-{{themeColor}}-200">Re: Application for {{jobTitle}}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{companyName}}</p>
          </div>

          <div class="space-y-4">
            <p class="font-medium">Dear {{hiringManager}},</p>

            <p>{{introduction}}</p>

            {{#if_has_experience}}<p>{{experience}}</p>{{/if_has_experience}}

            {{#if_has_skills}}
            <div class="break-inside-avoid">
              <p class="mb-2 font-medium text-{{themeColor}}-700">Key strengths for this role:</p>
              <ul class="pl-5 space-y-1 list-disc">
                {{skillsList}}
              </ul>
            </div>
            {{/if_has_skills}}

            {{#if_has_closing}}<p>{{closing}}</p>{{/if_has_closing}}

            <div class="mt-6 break-inside-avoid">
              <p>Best regards,</p>
              <p class="mt-2 font-medium">{{fullName}}</p>
            </div>
          </div>
        </div>
      `,
      sampleData: GENERIC_SAMPLE_DATA,
    },
  ];

  compiledContent = computed(() => {
    const template = this.#selectedTemplate();
    const data = this.formData();

    if (!template || !data) return '';

    let content = template.template;

    // Resolve {{tokens}} the user typed inside their own paragraphs first, so editing
    // Personal Info / Job Info updates the content without retyping it.
    const resolveTokens = (text: string): string =>
      text
        .replace(/{{fullName}}/g, data.fullName || 'Your Name')
        .replace(/{{email}}/g, data.email || 'your.email@example.com')
        .replace(/{{phone}}/g, data.phone || '(555) 123-4567')
        .replace(/{{address}}/g, data.address || 'Your Address')
        .replace(/{{jobTitle}}/g, data.jobTitle || 'Position Title')
        .replace(/{{companyName}}/g, data.companyName || 'Company Name')
        .replace(/{{hiringManager}}/g, data.hiringManager || 'Hiring Manager');

    const introduction = resolveTokens(
      data.introduction || 'Your introduction paragraph...',
    );
    const experience = resolveTokens(
      data.experience || 'Your experience details...',
    );
    const closing = resolveTokens(data.closing || 'Your closing statement...');

    // Replace placeholders
    content = content.replace(/{{themeColor}}/g, 'accent');
    content = content.replace(/{{fullName}}/g, data.fullName || 'Your Name');
    content = content.replace(
      /{{email}}/g,
      data.email || 'your.email@example.com',
    );
    content = content.replace(/{{phone}}/g, data.phone || '(555) 123-4567');
    content = content.replace(/{{address}}/g, data.address || 'Your Address');
    content = content.replace(
      /{{jobTitle}}/g,
      data.jobTitle || 'Position Title',
    );
    content = content.replace(
      /{{companyName}}/g,
      data.companyName || 'Company Name',
    );
    content = content.replace(
      /{{hiringManager}}/g,
      data.hiringManager || 'Hiring Manager',
    );
    content = content.replace(/{{introduction}}/g, introduction);
    content = content.replace(/{{experience}}/g, experience);
    content = content.replace(/{{closing}}/g, closing);
    content = content.replace(/{{date}}/g, data.date);

    // Process conditional sections
    const hasSkills = data.skills.length > 0;
    const hasAddress = data.address && data.address.trim() !== '';
    const hasExperience = data.experience && data.experience.trim() !== '';
    const hasClosing = data.closing && data.closing.trim() !== '';

    content = content.replace(
      /{{#if_has_skills}}([\s\S]*?){{\/if_has_skills}}/g,
      (match, p1) => {
        return hasSkills ? p1 : '';
      },
    );

    content = content.replace(
      /{{#if_has_address}}([\s\S]*?){{\/if_has_address}}/g,
      (match, p1) => {
        return hasAddress ? p1 : '';
      },
    );

    content = content.replace(
      /{{#if_has_experience}}([\s\S]*?){{\/if_has_experience}}/g,
      (match, p1) => {
        return hasExperience ? p1 : '';
      },
    );

    content = content.replace(
      /{{#if_has_closing}}([\s\S]*?){{\/if_has_closing}}/g,
      (match, p1) => {
        return hasClosing ? p1 : '';
      },
    );

    // Handle skills list
    const skillsList = hasSkills
      ? data.skills.map((skill) => `<li>${skill}</li>`).join('')
      : '';
    content = content.replace(/{{skillsList}}/g, skillsList);

    const skillsBadges = hasSkills
      ? data.skills
          .map(
            // inline-block + its own margin (not a flex `gap` wrapper) so spacing survives html2canvas PDF export
            (skill) =>
              `<span class="inline-block mr-2 mb-2 px-3 py-1 text-sm rounded-full bg-accent-100 text-accent-800">${skill}</span>`,
          )
          .join('')
      : '';
    content = content.replace(/{{skillsBadges}}/g, skillsBadges);

    return content;
  });

  getTemplates(): CoverLetterTemplate[] {
    return this.templates;
  }

  selectTemplate(templateId: string): void {
    const template = this.templates.find((t) => t.id === templateId);
    if (template) {
      this.#selectedTemplate.set(template);
      this.#jobData.set({ ...template.sampleData });
    }
  }

  updateJobData(data: Partial<JobLetterData>): void {
    this.#jobData.update((current) => ({ ...current, ...data }));
  }

  updateSkills(skills: string[]): void {
    this.#jobData.update((current) => ({ ...current, skills }));
  }

  saveCurrentProfile(name: string): void {
    const data = this.#jobData();
    const profile = this.storage.saveProfile(name, data);
    this.storage.setCurrentProfile(profile.id);
  }

  loadProfile(id: string): void {
    const profile = this.storage.getProfile(id);
    if (profile) {
      this.#jobData.set(profile.data);
      this.storage.setCurrentProfile(id);
    }
  }

  deleteProfile(id: string): void {
    this.storage.deleteProfile(id);
  }

  getAllProfiles() {
    return this.storage.getAllProfiles();
  }

  getCurrentProfileId(): string | null {
    return this.storage.getCurrentProfileId();
  }

  clearAutoSave(): void {
    this.storage.clearAutoSave();
  }
}
