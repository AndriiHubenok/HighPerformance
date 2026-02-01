import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { apiInterceptor, errorInterceptor, loadingInterceptor } from './core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        apiInterceptor,
        loadingInterceptor,
        errorInterceptor
      ])
    )
  ]
};
