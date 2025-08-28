import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AsyncPipe, isPlatformBrowser, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Observable, tap} from "rxjs";
import {BlogPost} from "../../core/models/blog.model";
import {BlogService} from "../../core/services/blog.service";
import { format } from 'date-fns';
import {Meta, Title} from "@angular/platform-browser";
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import {BlogListSkeletonComponent} from "../../skeleton/blog-list-skeleton/blog-list-skeleton.component";

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    AsyncPipe,
    NgOptimizedImage,
    BlogListSkeletonComponent
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms cubic-bezier(0.35, 0, 0.25, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ]),
    trigger('staggerIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(50px) scale(0.95)' }),
          stagger(100, [
            animate('700ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0) scale(1)' })
            )
          ])
        ], { optional: true })
      ])
    ]),
    trigger('heroAnimation', [
      transition(':enter', [
        query('.profile-image', [
          style({ opacity: 0, transform: 'scale(0.8) rotate(-5deg)' })
        ]),
        query('.hero-text > *', [
          style({ opacity: 0, transform: 'translateY(20px)' })
        ]),
        query('.profile-image', [
          animate('800ms 200ms cubic-bezier(0.35, 0, 0.25, 1)',
            style({ opacity: 1, transform: 'scale(1) rotate(0deg)' })
          )
        ]),
        query('.hero-text > *', [
          stagger(150, [
            animate('600ms 400ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ])
      ])
    ])
  ]
})
export class BlogListComponent implements OnInit {
  posts$!: Observable<BlogPost[]>;
  isLoading: boolean = true;

  constructor(
    private blogService: BlogService,
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  setMeta() {
    if (!isPlatformBrowser(this.platformId)) return;
    const title = 'BCA Project Sathi Blog';
    const description = 'Explore our blog for insights, updates, and stories from the BCA Project Sathi community.';
    const url = window.location.href;
    const image = window.location.origin + '/assets/images/bcaprojectsathi-banner.png';

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
    this.posts$ = this.blogService.getAllPosts().pipe(
      tap(() => this.isLoading = false)
    );    this.setMeta();
  }

  formatDate(date: Date): string {
    return format(date, 'MMM dd, yyyy');
  }

  fallbackImage: string = '/images/bcaprojectsathi-banner.png';
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }
}
