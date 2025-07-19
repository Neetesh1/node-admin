import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Post {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  published: boolean;
  slug: string;
  views: number;
  author: {
    id: string;
    email: string;
    username?: string;
  };
  categories: Category[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private apollo: Apollo) {}

  getPosts(published?: boolean): Observable<Post[]> {
    const POSTS_QUERY = gql`
      query Posts($published: Boolean) {
        posts(published: $published) {
          id
          title
          excerpt
          published
          slug
          views
          author {
            id
            email
            username
          }
          categories {
            id
            name
            slug
          }
          tags {
            id
            name
            slug
          }
          createdAt
          updatedAt
        }
      }
    `;

    return this.apollo.query<{ posts: Post[] }>({
      query: POSTS_QUERY,
      variables: { published }
    }).pipe(
      map(result => result.data.posts)
    );
  }

  getPost(id: string): Observable<Post> {
    const POST_QUERY = gql`
      query Post($id: String!) {
        post(id: $id) {
          id
          title
          content
          excerpt
          published
          slug
          views
          author {
            id
            email
            username
          }
          categories {
            id
            name
            slug
            description
          }
          tags {
            id
            name
            slug
          }
          createdAt
          updatedAt
        }
      }
    `;

    return this.apollo.query<{ post: Post }>({
      query: POST_QUERY,
      variables: { id }
    }).pipe(
      map(result => result.data.post)
    );
  }

  getPostBySlug(slug: string): Observable<Post> {
    const POST_BY_SLUG_QUERY = gql`
      query PostBySlug($slug: String!) {
        postBySlug(slug: $slug) {
          id
          title
          content
          excerpt
          published
          slug
          views
          author {
            id
            email
            username
          }
          categories {
            id
            name
            slug
            description
          }
          tags {
            id
            name
            slug
          }
          createdAt
          updatedAt
        }
      }
    `;

    return this.apollo.query<{ postBySlug: Post }>({
      query: POST_BY_SLUG_QUERY,
      variables: { slug }
    }).pipe(
      map(result => result.data.postBySlug)
    );
  }

  getMyPosts(): Observable<Post[]> {
    const MY_POSTS_QUERY = gql`
      query MyPosts {
        myPosts {
          id
          title
          excerpt
          published
          slug
          views
          categories {
            id
            name
            slug
          }
          tags {
            id
            name
            slug
          }
          createdAt
          updatedAt
        }
      }
    `;

    return this.apollo.query<{ myPosts: Post[] }>({
      query: MY_POSTS_QUERY
    }).pipe(
      map(result => result.data.myPosts)
    );
  }

  createPost(postData: {
    title: string;
    content?: string;
    excerpt?: string;
    published?: boolean;
    slug: string;
    categoryIds?: string[];
    tagIds?: string[];
  }): Observable<Post> {
    const CREATE_POST_MUTATION = gql`
      mutation CreatePost($data: CreatePostInput!) {
        createPost(data: $data) {
          id
          title
          content
          excerpt
          published
          slug
          views
          author {
            id
            email
            username
          }
          categories {
            id
            name
            slug
          }
          tags {
            id
            name
            slug
          }
          createdAt
          updatedAt
        }
      }
    `;

    return this.apollo.mutate<{ createPost: Post }>({
      mutation: CREATE_POST_MUTATION,
      variables: { data: postData }
    }).pipe(
      map(result => result.data!.createPost)
    );
  }

  updatePost(id: string, postData: {
    title?: string;
    content?: string;
    excerpt?: string;
    published?: boolean;
    slug?: string;
    categoryIds?: string[];
    tagIds?: string[];
  }): Observable<Post> {
    const UPDATE_POST_MUTATION = gql`
      mutation UpdatePost($id: String!, $data: UpdatePostInput!) {
        updatePost(id: $id, data: $data) {
          id
          title
          content
          excerpt
          published
          slug
          views
          author {
            id
            email
            username
          }
          categories {
            id
            name
            slug
          }
          tags {
            id
            name
            slug
          }
          createdAt
          updatedAt
        }
      }
    `;

    return this.apollo.mutate<{ updatePost: Post }>({
      mutation: UPDATE_POST_MUTATION,
      variables: { id, data: postData }
    }).pipe(
      map(result => result.data!.updatePost)
    );
  }

  deletePost(id: string): Observable<boolean> {
    const DELETE_POST_MUTATION = gql`
      mutation DeletePost($id: String!) {
        deletePost(id: $id)
      }
    `;

    return this.apollo.mutate<{ deletePost: boolean }>({
      mutation: DELETE_POST_MUTATION,
      variables: { id }
    }).pipe(
      map(result => result.data!.deletePost)
    );
  }
}
