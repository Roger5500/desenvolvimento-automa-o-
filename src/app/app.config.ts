import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { noAuthZaiInterceptor } from './interceptors/no-auth-zai.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        noAuthZaiInterceptor
      ])
    )
  ]
};