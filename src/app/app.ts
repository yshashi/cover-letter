import { Component, signal } from '@angular/core';
import { TemplateSelectorComponent } from "./components/template-selector";
import { HeaderComponent } from "./components/header";
import { FormEditor } from "./components/form-editor";
import { PreviewComponent } from "./components/preview";

@Component({
  selector: 'app-root',
  imports: [TemplateSelectorComponent, HeaderComponent, FormEditor, PreviewComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cover-letter');
}
