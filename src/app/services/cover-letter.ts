import { Injectable, signal, computed, effect, inject } from '@angular/core';
import {
  CoverLetterData,
  CoverLetterTemplate,
  JobLetterData,
} from '../models/cover-letter';
import { StorageService } from './storage';
import { PersonalInfoService } from './personal-info';

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
      sampleData: {
        jobTitle: 'Software Developer',
        companyName: 'Tech Solutions Inc.',
        hiringManager: 'Ms. Sarah Johnson',
        introduction:
          'I am writing to express my strong interest in the Software Developer position at Tech Solutions Inc. With over 3 years of experience in full-stack development, I am excited about the opportunity to contribute to your innovative team.',
        skills: [
          'JavaScript & TypeScript',
          'React & Angular',
          'Node.js & Express',
          'Database Management',
          'Agile Development',
        ],
        experience:
          'In my current role at Digital Innovations, I have successfully led the development of multiple web applications, resulting in a 40% increase in user engagement. My expertise in modern frameworks and commitment to clean, maintainable code make me an ideal candidate for this position.',
        closing:
          "I am eager to discuss how my skills and passion for technology can contribute to Tech Solutions Inc.'s continued success. Thank you for considering my application.",
        date: new Date().toLocaleDateString(),
      },
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
      sampleData: {
        jobTitle: 'UX Designer',
        companyName: 'Creative Studios',
        hiringManager: 'Mr. Alex Chen',
        introduction:
          "As a passionate UX Designer with 4 years of experience creating user-centered digital experiences, I am thrilled to apply for the UX Designer position at Creative Studios. Your company's commitment to innovative design solutions aligns perfectly with my creative vision.",
        skills: [
          'User Research & Testing',
          'Wireframing & Prototyping',
          'Figma & Sketch',
          'Design Systems',
          'Accessibility Design',
        ],
        experience:
          'At Innovation Labs, I redesigned the mobile app interface, leading to a 60% increase in user satisfaction scores. My collaborative approach and attention to detail have consistently delivered exceptional results.',
        closing:
          'I would love to bring my creativity and user-focused approach to Creative Studios. Thank you for your time and consideration.',
        date: new Date().toLocaleDateString(),
      },
    },
    {
      id: 'impact',
      name: 'Impact',
      description:
        'ATS-friendly, results-first layout recruiters scan in seconds',
      template: `
        <div class="space-y-6 dark:text-gray-200">
          <div class="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-{{themeColor}}-600 pb-4">
            <h1 class="text-2xl font-bold tracking-tight text-{{themeColor}}-700">{{fullName}}</h1>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{email}} · {{phone}}{{#if_has_address}} · {{address}}{{/if_has_address}}
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="font-semibold text-gray-800 dark:text-gray-300">Re: Application for {{jobTitle}} — {{companyName}}</p>
            <p class="text-sm text-gray-500">{{date}}</p>
          </div>

          <div class="space-y-4">
            <p>Dear {{hiringManager}},</p>

            <p class="leading-relaxed">{{introduction}}</p>

            {{#if_has_experience}}
            <div class="border-l-2 border-{{themeColor}}-500 pl-4">
              <p class="leading-relaxed">{{experience}}</p>
            </div>
            {{/if_has_experience}}

            {{#if_has_skills}}
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-{{themeColor}}-700 mb-2">What I bring to {{companyName}}</p>
              <div class="flex flex-wrap gap-2">
                {{skillsBadges}}
              </div>
            </div>
            {{/if_has_skills}}

            {{#if_has_closing}}<p class="leading-relaxed">{{closing}}</p>{{/if_has_closing}}

            <div class="pt-2">
              <p>Best regards,</p>
              <p class="mt-1 font-semibold text-{{themeColor}}-700">{{fullName}}</p>
            </div>
          </div>
        </div>
      `,
      sampleData: {
        jobTitle: 'Senior Software Engineer',
        companyName: 'Nimbus Labs',
        hiringManager: 'Hiring Team',
        introduction:
          'Your posting for a Senior Software Engineer stood out because it asks for someone who can ship AI-assisted features end to end — exactly what I have spent the last two years doing. At my current company I took an LLM-powered support assistant from prototype to production, cutting average ticket resolution time by 42% for 30,000+ monthly users.',
        skills: [
          'TypeScript & Node.js',
          'React / Angular',
          'LLM & RAG integrations',
          'Cloud (AWS) & CI/CD',
          'System design at scale',
        ],
        experience:
          'Beyond shipping features, I focus on outcomes the business can measure: I led a migration that reduced infrastructure spend by $180K/year, mentored four engineers to promotion, and cut release cycle time from two weeks to two days by rebuilding our deployment pipeline. I work best in teams that value ownership, fast feedback, and pragmatic engineering.',
        closing:
          'I would welcome a short call to discuss how this experience maps to your roadmap. Thank you for your time — I know it is limited, and I appreciate you spending some of it here.',
        date: new Date().toLocaleDateString(),
      },
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
            (skill) =>
              `<span class="px-3 py-1 text-sm rounded-full bg-accent-100 text-accent-800">${skill}</span>`,
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
