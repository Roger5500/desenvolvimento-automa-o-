import { Component } from '@angular/core';
import { WhatsAnalyzerComponent } from './whats-analyzer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WhatsAnalyzerComponent],
  template: `<app-whats-analyzer></app-whats-analyzer>`
})
export class AppComponent {}