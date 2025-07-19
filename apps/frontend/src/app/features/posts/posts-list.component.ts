import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService, Post } from '../../core/services/post.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="posts-container">
      <div class="posts-header">
        <h1>Blog Posts</h1>
        @if (authService.isAuthenticated()) {
          <a routerLink="/posts/create" class="btn btn-primary">Create Post</a>
        }
      </div>

      @if (loading()) {
        <div class="loading">Loading posts...</div>
      }

      @if (error()) {
        <div class="alert alert-error">
          {{ error() }}
        </div>
      }

      <div class="posts-grid">
        @for (post of posts(); track post.id) {
          <article class="post-card">
            <div class="post-header">
              <h2>
                <a [routerLink]="['/posts', post.slug]">{{ post.title }}</a>
              </h2>
              <div class="post-meta">
                <span class="author">By {{ post.author.username || post.author.email }}</span>
                <span class="date">{{ formatDate(post.createdAt) }}</span>
                <span class="views">{{ post.views }} views</span>
              </div>
            </div>

            @if (post.excerpt) {
              <p class="post-excerpt">{{ post.excerpt }}</p>
            }

            <div class="post-footer">
              @if (post.categories.length > 0) {
                <div class="categories">
                  @for (category of post.categories; track category.id) {
                    <span class="category-tag">{{ category.name }}</span>
                  }
                </div>
              }

              @if (post.tags.length > 0) {
                <div class="tags">
                  @for (tag of post.tags; track tag.id) {
                    <span class="tag">{{ tag.name }}</span>
                  }
                </div>
              }
            </div>

            <div class="post-actions">
              <a [routerLink]="['/posts', post.slug]" class="btn btn-outline">Read More</a>
              @if (canEditPost(post)) {
                <a [routerLink]="['/posts', post.id, 'edit']" class="btn btn-sm">Edit</a>
              }
            </div>
          </article>
        }
      </div>

      @if (posts().length === 0 && !loading()) {
        <div class="empty-state">
          <h3>No posts found</h3>
          <p>Be the first to create a post!</p>
          @if (authService.isAuthenticated()) {
            <a routerLink="/posts/create" class="btn btn-primary">Create First Post</a>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './posts-list.component.scss'
})
export class PostsListComponent implements OnInit {
  posts = signal<Post[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(
    private postService: PostService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    this.error.set('');

    this.postService.getPosts(true).subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load posts. Please try again.');
        this.loading.set(false);
        console.error('Error loading posts:', err);
      }
    });
  }

  canEditPost(post: Post): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser ?
      (currentUser.id === post.author.id || currentUser.role === 'ADMIN') :
      false;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
