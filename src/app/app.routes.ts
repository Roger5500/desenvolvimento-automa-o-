import { Routes } from '@angular/router';
import { WhatsAnalyzerComponent } from './whats-analyzer.component';

export const routes: Routes = [
  { path: 'whatsanalizer', component: WhatsAnalyzerComponent },
  { path: '**', redirectTo: 'whatsanalizer' }
];
