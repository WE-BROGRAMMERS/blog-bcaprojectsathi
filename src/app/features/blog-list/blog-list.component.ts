import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {AsyncPipe, isPlatformBrowser, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Observable, tap} from "rxjs";
import {BlogPost} from "../../core/models/blog.model";
import {BlogService} from "../../core/services/blog/blog.service";
import { format } from 'date-fns';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import {BlogListSkeletonComponent} from "../../skeleton/blog-list-skeleton/blog-list-skeleton.component";
import {SeoService} from "../../core/services/seo/seo.service";

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
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  setMeta() {
    this.seo.updateMeta({
      title: 'BCA Project Sathi Blog',
      description: 'Explore our blog for insights, updates, and stories from the BCA Project Sathi community.',
      keywords: 'BCA, blog, projects, web development, programming, tech',
      url: isPlatformBrowser(this.platformId) ? window.location.href : '',
      image: isPlatformBrowser(this.platformId) ? window.location.origin + '/assets/images/bcaprojectsathi-banner.png' : '',
      type: 'website'
    });
  }

  ngOnInit() {
    this.posts$ = this.blogService.getAllPosts().pipe(
      tap(() => this.isLoading = false)
    );    this.setMeta();
  }

  formatDate(date: Date): string {
    return format(date, 'MMM dd, yyyy');
  }

  getOptimizedImage(url: string, width: number = 600, height: number = 192): string {
    return `https://res.cloudinary.com/dpr74fre2/image/fetch/f_auto,q_auto,c_fill,w_${width},h_${height}/${url}`;
  }

  getBlurredImage(url: string): string {
    return `https://res.cloudinary.com/dpr74fre2/image/fetch/e_blur:200,q_1,w_20/${url}`;
  }


  fallbackImage: string = '/images/bcaprojectsathi-banner.png';
  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }
}
