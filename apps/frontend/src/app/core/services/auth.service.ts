import { Injectable, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  username?: string;
  role: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'token';

  constructor(private apollo: Apollo) {
    this.checkToken();
  }

  private checkToken(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      this.getCurrentUser().subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    }
  }

  register(email: string, username: string, password: string): Observable<AuthResponse> {
    const REGISTER_MUTATION = gql`
      mutation Register($data: RegisterInput!) {
        register(data: $data) {
          token
          user {
            id
            email
            username
            role
            profile {
              firstName
              lastName
              bio
              avatar
            }
          }
        }
      }
    `;

    return this.apollo.mutate<{ register: AuthResponse }>({
      mutation: REGISTER_MUTATION,
      variables: {
        data: { email, username, password }
      }
    }).pipe(
      map(result => result.data!.register),
      tap(authResponse => {
        localStorage.setItem(this.tokenKey, authResponse.token);
        this.currentUserSubject.next(authResponse.user);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const LOGIN_MUTATION = gql`
      mutation Login($data: LoginInput!) {
        login(data: $data) {
          token
          user {
            id
            email
            username
            role
            profile {
              firstName
              lastName
              bio
              avatar
            }
          }
        }
      }
    `;

    return this.apollo.mutate<{ login: AuthResponse }>({
      mutation: LOGIN_MUTATION,
      variables: {
        data: { email, password }
      }
    }).pipe(
      map(result => result.data!.login),
      tap(authResponse => {
        localStorage.setItem(this.tokenKey, authResponse.token);
        this.currentUserSubject.next(authResponse.user);
      })
    );
  }

  getCurrentUser(): Observable<User> {
    const ME_QUERY = gql`
      query Me {
        me {
          id
          email
          username
          role
          profile {
            firstName
            lastName
            bio
            avatar
          }
        }
      }
    `;

    return this.apollo.query<{ me: User }>({
      query: ME_QUERY
    }).pipe(
      map(result => result.data.me)
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.apollo.client.clearStore();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
