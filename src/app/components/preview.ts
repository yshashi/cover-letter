import { Component, ElementRef, ViewChild, computed, inject, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import html2pdf from 'html2pdf.js';
import { CoverLetter } from '../services/cover-letter';

@Component({
  selector: 'app-preview',
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="form-label text-lg font-semibold">Live Preview</h3>
        <button
          (click)="downloadPDF()"
          class="btn-primary flex items-center space-x-2"
          [disabled]="!compiledContent()"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Download PDF</span>
        </button>
      </div>

      <div
        class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[600px]"
      >
        <div
          #previewContainer
          class="preview-container"
          [innerHTML]="sanitizedContent()"
        ></div>
      </div>

      <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
        This preview shows how your cover letter will appear when downloaded as PDF
      </div>
    </div>
  `
})
export class PreviewComponent {
  previewCont = viewChild<ElementRef>('previewContainer');

  private readonly coverLetter = inject(CoverLetter);
  private readonly sanitizer = inject(DomSanitizer);

  compiledContent = this.coverLetter.compiledContent;

  sanitizedContent = computed(() => {
    const content = this.compiledContent();
    return content ? this.sanitizer.bypassSecurityTrustHtml(content) : '';
  });

  async downloadPDF(): Promise<void> {
    const element = this.previewCont()?.nativeElement;

    if (!element || !element.innerHTML.trim()) {
      console.error('No content to export');
      return;
    }

    try {
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'cover-letter.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false
        },
        jsPDF: {
          unit: 'in',
          format: 'letter',
          orientation: 'portrait'
        }
      };

      await html2pdf().set(opt as any).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
}
