import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink).create({
        uri: 'http://localhost:4000/graphql',
      });

      const authLink = setContext((_, { headers }) => {
        const token = localStorage.getItem('auth_token');
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          }
        };
      });

      return {
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            errorPolicy: 'all',
          },
        },
      };
    }),
  ]
};
