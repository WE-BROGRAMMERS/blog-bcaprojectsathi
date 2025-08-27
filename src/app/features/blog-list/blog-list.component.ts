import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Observable} from "rxjs";
import {BlogPost} from "../../core/models/blog.model";
import {BlogService} from "../../core/services/blog.service";
import { format } from 'date-fns';
import {Meta, Title} from "@angular/platform-browser";


@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss'
})
export class BlogListComponent implements OnInit {
  posts$!: Observable<BlogPost[]>;

  constructor(
    private blogService: BlogService,
    private meta: Meta,
    private title: Title
  ) {}

  setMeta() {
    if(!window) return;
    const title = 'BCA Project Sathi Blog';
    const description = 'Explore our blog for insights, updates, and stories from the BCA Project Sathi community.';
    const url = window.location.href;
    const image = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600';

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: 'BCA, blog, projects, web development, programming, tech' });

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical link
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  ngOnInit() {
    this.posts$ = this.blogService.getAllPosts();
    this.setMeta();
  }

  formatDate(date: Date): string {
    return format(date, 'MMM dd, yyyy');
  }


  fallbackImage: string =
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face';

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }

}
