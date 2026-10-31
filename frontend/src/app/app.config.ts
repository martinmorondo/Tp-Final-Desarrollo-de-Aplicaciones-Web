import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth.interceptor';
import { mockInterceptor } from './core/mock.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([mockInterceptor, authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};

