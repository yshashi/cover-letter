import { Injectable, signal, computed } from '@angular/core';
import { CoverLetterData, CoverLetterTemplate } from '../models/cover-letter';

@Injectable({
  providedIn: 'root'
})
export class CoverLetter {
  #selectedTemplate = signal<CoverLetterTemplate | null>(null);
  #formData = signal<CoverLetterData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    jobTitle: '',
    companyName: '',
    hiringManager: '',
    introduction: '',
    skills: [],
    experience: '',
    closing: '',
    date: new Date().toLocaleDateString()
  });

  selectedTemplate = this.#selectedTemplate.asReadonly();
  formData = this.#formData.asReadonly();

  private templates: CoverLetterTemplate[] = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'A classic, formal cover letter template',
      template: `
        <div class="space-y-6">
          <div class="text-right text-sm text-gray-600">
            {{date}}
          </div>

          <div class="space-y-1">
            <h1 class="text-2xl font-bold text-{{themeColor}}-700">{{fullName}}</h1>
            <div class="text-sm text-gray-600">
              <div>{{email}} | {{phone}}</div>
              <div>{{address}}</div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="font-medium">{{hiringManager}}</div>
            <div class="font-medium">{{companyName}}</div>
          </div>

          <div class="space-y-4">
            <p class="font-medium">Dear {{hiringManager}},</p>

            <p>{{introduction}}</p>

            <div>
              <p class="mb-2">My key qualifications include:</p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                {{skillsList}}
              </ul>
            </div>

            <p>{{experience}}</p>

            <p>{{closing}}</p>

            <div class="mt-6">
              <p>Sincerely,</p>
              <p class="font-medium mt-2">{{fullName}}</p>
            </div>
          </div>
        </div>
      `,
      sampleData: {
        fullName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        address: '123 Main Street, City, State 12345',
        jobTitle: 'Software Developer',
        companyName: 'Tech Solutions Inc.',
        hiringManager: 'Ms. Sarah Johnson',
        introduction: 'I am writing to express my strong interest in the Software Developer position at Tech Solutions Inc. With over 3 years of experience in full-stack development, I am excited about the opportunity to contribute to your innovative team.',
        skills: ['JavaScript & TypeScript', 'React & Angular', 'Node.js & Express', 'Database Management', 'Agile Development'],
        experience: 'In my current role at Digital Innovations, I have successfully led the development of multiple web applications, resulting in a 40% increase in user engagement. My expertise in modern frameworks and commitment to clean, maintainable code make me an ideal candidate for this position.',
        closing: 'I am eager to discuss how my skills and passion for technology can contribute to Tech Solutions Inc.\'s continued success. Thank you for considering my application.',
        date: new Date().toLocaleDateString()
      }
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'A modern, creative template with visual appeal',
      template: `
        <div class="space-y-6">
          <div class="border-l-4 border-{{themeColor}}-500 pl-4">
            <h1 class="text-3xl font-bold text-{{themeColor}}-700">{{fullName}}</h1>
            <p class="text-lg text-gray-600">Applying for {{jobTitle}}</p>
            <div class="text-sm text-gray-500 mt-2">
              {{email}} | {{phone}} | {{address}}
            </div>
          </div>

          <div class="bg-{{themeColor}}-50 p-4 rounded-lg">
            <h2 class="text-lg font-semibold text-{{themeColor}}-800 mb-2">Dear {{hiringManager}},</h2>
            <p class="text-gray-700">{{introduction}}</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-{{themeColor}}-700 mb-3">Why I'm Perfect for {{companyName}}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg border border-{{themeColor}}-200">
                <h4 class="font-medium text-{{themeColor}}-600 mb-2">Key Skills</h4>
                <ul class="space-y-1 text-sm">
                  {{skillsList}}
                </ul>
              </div>
              <div class="bg-white p-4 rounded-lg border border-{{themeColor}}-200">
                <h4 class="font-medium text-{{themeColor}}-600 mb-2">Experience</h4>
                <p class="text-sm text-gray-700">{{experience}}</p>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-gray-700">{{closing}}</p>
          </div>

          <div class="text-right">
            <p class="text-sm text-gray-500">{{date}}</p>
            <p class="font-medium text-{{themeColor}}-700 mt-2">{{fullName}}</p>
          </div>
        </div>
      `,
      sampleData: {
        fullName: 'Emma Davis',
        email: 'emma.davis@email.com',
        phone: '(555) 987-6543',
        address: '456 Creative Ave, Design City, DC 67890',
        jobTitle: 'UX Designer',
        companyName: 'Creative Studios',
        hiringManager: 'Mr. Alex Chen',
        introduction: 'As a passionate UX Designer with 4 years of experience creating user-centered digital experiences, I am thrilled to apply for the UX Designer position at Creative Studios. Your company\'s commitment to innovative design solutions aligns perfectly with my creative vision.',
        skills: ['User Research & Testing', 'Wireframing & Prototyping', 'Figma & Sketch', 'Design Systems', 'Accessibility Design'],
        experience: 'At Innovation Labs, I redesigned the mobile app interface, leading to a 60% increase in user satisfaction scores. My collaborative approach and attention to detail have consistently delivered exceptional results.',
        closing: 'I would love to bring my creativity and user-focused approach to Creative Studios. Thank you for your time and consideration.',
        date: new Date().toLocaleDateString()
      }
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'A clean, minimalist template with modern aesthetics',
      template: `
        <div class="space-y-8">
          <div class="text-center space-y-2">
            <h1 class="text-4xl font-light text-{{themeColor}}-800">{{fullName}}</h1>
            <div class="w-16 h-1 bg-{{themeColor}}-500 mx-auto"></div>
            <p class="text-gray-600">{{email}} • {{phone}}</p>
            <p class="text-gray-500 text-sm">{{address}}</p>
          </div>

          <div class="text-center">
            <h2 class="text-2xl font-light text-{{themeColor}}-700 mb-4">Application for {{jobTitle}}</h2>
            <p class="text-lg text-gray-600">{{companyName}}</p>
          </div>

          <div class="space-y-6">
            <div class="border-b border-{{themeColor}}-200 pb-4">
              <h3 class="text-lg font-medium text-{{themeColor}}-700 mb-3">Introduction</h3>
              <p class="text-gray-700 leading-relaxed">{{introduction}}</p>
            </div>

            <div class="border-b border-{{themeColor}}-200 pb-4">
              <h3 class="text-lg font-medium text-{{themeColor}}-700 mb-3">Core Competencies</h3>
              <div class="flex flex-wrap gap-2">
                {{skillsBadges}}
              </div>
            </div>

            <div class="border-b border-{{themeColor}}-200 pb-4">
              <h3 class="text-lg font-medium text-{{themeColor}}-700 mb-3">Professional Experience</h3>
              <p class="text-gray-700 leading-relaxed">{{experience}}</p>
            </div>

            <div>
              <h3 class="text-lg font-medium text-{{themeColor}}-700 mb-3">Closing Statement</h3>
              <p class="text-gray-700 leading-relaxed">{{closing}}</p>
            </div>
          </div>

          <div class="text-center pt-6">
            <p class="text-gray-500 text-sm">{{date}}</p>
            <p class="text-{{themeColor}}-700 font-medium mt-2">{{fullName}}</p>
          </div>
        </div>
      `,
      sampleData: {
        fullName: 'Michael Johnson',
        email: 'michael.johnson@email.com',
        phone: '(555) 456-7890',
        address: '789 Modern Blvd, Tech City, TC 13579',
        jobTitle: 'Product Manager',
        companyName: 'Future Tech Corp',
        hiringManager: 'Dr. Lisa Wang',
        introduction: 'I am excited to apply for the Product Manager position at Future Tech Corp. With 5 years of experience in product development and a proven track record of launching successful digital products, I am confident in my ability to drive innovation and growth for your organization.',
        skills: ['Product Strategy', 'Agile & Scrum', 'Market Research', 'Data Analysis', 'Cross-functional Leadership'],
        experience: 'In my role as Senior Product Analyst at StartUp Solutions, I led the development of three major product features that increased user retention by 35% and generated $2M in additional revenue. My analytical approach and collaborative leadership style have consistently delivered exceptional results.',
        closing: 'I am passionate about creating products that solve real problems and would welcome the opportunity to discuss how my experience can contribute to Future Tech Corp\'s mission. Thank you for your consideration.',
        date: new Date().toLocaleDateString()
      }
    }
  ];

  compiledContent = computed(() => {
    const template = this.#selectedTemplate();
    const data = this.#formData();

    if (!template || !data) return '';

    let content = template.template;

    // Replace placeholders
    content = content.replace(/{{fullName}}/g, data.fullName || 'Your Name');
    content = content.replace(/{{email}}/g, data.email || 'your.email@example.com');
    content = content.replace(/{{phone}}/g, data.phone || '(555) 123-4567');
    content = content.replace(/{{address}}/g, data.address || 'Your Address');
    content = content.replace(/{{jobTitle}}/g, data.jobTitle || 'Position Title');
    content = content.replace(/{{companyName}}/g, data.companyName || 'Company Name');
    content = content.replace(/{{hiringManager}}/g, data.hiringManager || 'Hiring Manager');
    content = content.replace(/{{introduction}}/g, data.introduction || 'Your introduction paragraph...');
    content = content.replace(/{{experience}}/g, data.experience || 'Your experience details...');
    content = content.replace(/{{closing}}/g, data.closing || 'Your closing statement...');
    content = content.replace(/{{date}}/g, data.date);

    // Handle skills list
    const skillsList = data.skills.length > 0
      ? data.skills.map(skill => `<li>${skill}</li>`).join('')
      : '<li>Your skills here...</li>';
    content = content.replace(/{{skillsList}}/g, skillsList);

    // Handle skills badges for modern template
    const skillsBadges = data.skills.length > 0
      ? data.skills.map(skill => `<span class="px-3 py-1 rounded-full text-sm">${skill}</span>`).join('')
      : '<span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Your skills here...</span>';
    content = content.replace(/{{skillsBadges}}/g, skillsBadges);

    return content;
  });

  getTemplates(): CoverLetterTemplate[] {
    return this.templates;
  }

  selectTemplate(templateId: string): void {
    const template = this.templates.find(t => t.id === templateId);
    if (template) {
      this.#selectedTemplate.set(template);
      this.#formData.set({ ...template.sampleData });
    }
  }

  updateFormData(data: Partial<CoverLetterData>): void {
    this.#formData.update(current => ({ ...current, ...data }));
  }

  updateSkills(skills: string[]): void {
    this.#formData.update(current => ({ ...current, skills }));
  }

}
