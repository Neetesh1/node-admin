import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PostsListComponent } from './components/posts-list/posts-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/posts', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostsListComponent },
  { path: '**', redirectTo: '/posts' }
];
