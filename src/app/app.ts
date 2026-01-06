import { Component, signal, OnInit } from '@angular/core';
import { TemplateSelectorComponent } from './components/template-selector';
import { HeaderComponent } from './components/header';
import { FormEditor } from './components/form-editor';
import { PreviewComponent } from './components/preview';
import { NotificationComponent } from './components/notification';
import { ProfileManagerComponent } from './components/profile-manager';

@Component({
  selector: 'app-root',
  imports: [
    TemplateSelectorComponent,
    HeaderComponent,
    FormEditor,
    PreviewComponent,
    NotificationComponent,
    ProfileManagerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('cover-letter');
  protected readonly isReady = signal(false);

  ngOnInit(): void {
    // Small delay to ensure services are initialized before rendering
    setTimeout(() => {
      this.isReady.set(true);
    }, 0);
  }
}
