import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  viewChild,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import html2pdf from 'html2pdf.js';
import { CoverLetter } from '../services/cover-letter';
import { NotificationService } from '../services/notification';

@Component({
  selector: 'app-preview',
  template: `
    <div class="space-y-4 animate-fade-in">
      <div class="flex justify-between items-center flex-wrap gap-3">
        <h3
          class="inline-block text-transparent bg-clip-text section-title bg-gradient-primary-to-secondary"
        >
          Live Preview
        </h3>
        <div class="flex items-center gap-2">
          <button
            (click)="copyToClipboard()"
            class="flex items-center space-x-2 btn-secondary text-sm"
            [disabled]="!compiledContent()"
            [class.opacity-50]="!compiledContent()"
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
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
            <span class="hidden sm:inline">Copy</span>
          </button>
          <button
            (click)="downloadPDF()"
            class="flex items-center space-x-2 btn-primary text-sm"
            [disabled]="!compiledContent() || isDownloading()"
            [class.opacity-50]="!compiledContent() || isDownloading()"
          >
            @if (isDownloading()) {
            <svg
              class="w-4 h-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            } @else {
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            }
            <span class="hidden sm:inline">{{
              isDownloading() ? 'Generating...' : 'Download PDF'
            }}</span>
          </button>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[600px] shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in-up"
      >
        <div
          #previewContainer
          class="p-4 bg-white rounded-lg shadow-inner preview-container dark:bg-gray-800 dark:text-gray-100"
          [innerHTML]="sanitizedContent()"
        ></div>
      </div>

      <div
        class="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 animate-fade-in"
        style="animation-delay: 300ms"
      >
        <div class="inline-flex items-center">
          <svg
            class="mr-1 w-4 h-4 text-primary-500"
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
          This preview shows how your cover letter will appear when downloaded
          as PDF
        </div>
      </div>
    </div>
  `,
})
export class PreviewComponent {
  previewCont = viewChild<ElementRef>('previewContainer');

  private readonly coverLetter = inject(CoverLetter);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly notification = inject(NotificationService);

  protected isDownloading = signal(false);

  compiledContent = this.coverLetter.compiledContent;

  sanitizedContent = computed(() => {
    const content = this.compiledContent();
    return content ? this.sanitizer.bypassSecurityTrustHtml(content) : '';
  });

  async copyToClipboard(): Promise<void> {
    const element = this.previewCont()?.nativeElement;
    if (!element || !element.innerText.trim()) {
      this.notification.warning('No content to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(element.innerText);
      this.notification.success('Content copied to clipboard!');
    } catch (error) {
      this.notification.error('Failed to copy content');
      console.error('Error copying to clipboard:', error);
    }
  }

  async downloadPDF(): Promise<void> {
    const element = this.previewCont()?.nativeElement;

    if (!element || !element.innerHTML.trim()) {
      this.notification.warning('No content to export');
      return;
    }

    this.isDownloading.set(true);

    try {
      const clonedElement = element.cloneNode(true) as HTMLElement;

      clonedElement.style.fontFamily = 'Roboto, sans-serif';
      clonedElement.style.backgroundColor = '#ffffff';
      clonedElement.style.color = '#000000';
      clonedElement.style.padding = '20px';
      clonedElement.style.border = 'none';
      clonedElement.style.boxShadow = 'none';

      const allElements = clonedElement.querySelectorAll('*');
      allElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          if (el.className) {
            el.className = el.className
              .split(' ')
              .filter((cls) => !cls.startsWith('dark:'))
              .join(' ');
          }
          el.style.border = 'none';
          el.style.boxShadow = 'none';
        }
      });

      const opt = {
        margin: [0.75, 0.75, 0.75, 0.75],
        filename: `${
          this.coverLetter.formData()?.fullName || 'cover-letter'
        }_coverletter.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait',
        },
      };

      await html2pdf()
        .set(opt as any)
        .from(clonedElement)
        .save();
      this.notification.success('PDF downloaded successfully!');
    } catch (error) {
      this.notification.error('Failed to generate PDF');
      console.error('Error generating PDF:', error);
    } finally {
      this.isDownloading.set(false);
    }
  }
}
