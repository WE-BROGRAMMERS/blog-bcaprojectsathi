import { Injectable } from '@angular/core';
import { BlogPost, AuthorProfile } from '../models/blog.model';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

function mapAuthorProfile(data: any): AuthorProfile {
  return {
    id: data.id,
    name: data.name,
    avatar: data.avatar,
    bio: data.bio,
    website: data.website,
    twitter: data.twitter,
    linkedin: data.linkedin,
    github: data.github,
    created_at: data.created_at ? new Date(data.created_at) : undefined,
  };
}

function mapBlogPost(data: any): BlogPost {
  return <BlogPost>{
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author ? mapAuthorProfile(data.author) : undefined,
    publishedDate: data.published_date ? new Date(data.published_date) : undefined,
    readingTime: data.reading_time,
    thumbnail: data.thumbnail,
    tags: data.tags,
    slug: data.slug,
    seoTitle: data.seo_title,
    seoDescription: data.seo_description,
    seoKeywords: data.seo_keywords,
  };
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor() {}

  getAllPosts(): Observable<BlogPost[]> {
    return from(
      supabase
        .from('blog_posts')
        .select(`
          id, title, excerpt, published_date, reading_time, thumbnail, tags, slug,
          author:profiles (
            id, name, avatar, bio, website, twitter, linkedin, github
          )
        `)
        .order('published_date', { ascending: false })
    ).pipe(
      map(result => (result.data || []).map(mapBlogPost))
    );
  }

  getPostBySlug(slug: string): Observable<BlogPost | undefined> {
    return from(
      supabase
        .from('blog_posts')
        .select(`
          id, title, excerpt, content, published_date, reading_time, thumbnail, tags, slug, seo_title, seo_description, seo_keywords,
          author:profiles (
            id, name, avatar, bio, website, twitter, linkedin, github
          )
        `)
        .eq('slug', slug)
        .single()
    ).pipe(
      map(result => result.data ? mapBlogPost(result.data) : undefined)
    );
  }
}
