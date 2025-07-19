import { Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

interface User {
  id: string;
  email: string;
  username?: string;
  role: string;
}

interface LoginResponse {
  login: {
    user: User;
    token: string;
  };
}

interface RegisterResponse {
  register: {
    user: User;
    token: string;
  };
}

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        username
        role
      }
      token
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $username: String) {
    register(email: $email, password: $password, username: $username) {
      user {
        id
        email
        username
        role
      }
      token
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private tokenKey = 'auth_token';

  constructor(
    private apollo: Apollo,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  get currentUser() {
    return this.currentUserSignal();
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  login(email: string, password: string) {
    return this.apollo.mutate<LoginResponse>({
      mutation: LOGIN_MUTATION,
      variables: { email, password }
    }).pipe(
      map(result => result.data?.login),
      tap(loginData => {
        if (loginData) {
          this.setAuthData(loginData.user, loginData.token);
        }
      })
    );
  }

  register(email: string, password: string, username?: string) {
    return this.apollo.mutate<RegisterResponse>({
      mutation: REGISTER_MUTATION,
      variables: { email, password, username }
    }).pipe(
      map(result => result.data?.register),
      tap(registerData => {
        if (registerData) {
          this.setAuthData(registerData.user, registerData.token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('auth_user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  private setAuthData(user: User, token: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private loadUserFromStorage() {
    const token = this.getToken();
    const userStr = localStorage.getItem('auth_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSignal.set(user);
      } catch (error) {
        console.error('Error parsing user data from storage:', error);
        this.logout();
      }
    }
  }
}
