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
    this.title.setTitle('BCA Project Sathi Blog');
    this.meta.updateTag({ name: 'description', content: 'Explore our blog for insights, updates, and stories from the BCA Project Sathi community.' });
    this.meta.updateTag({ property: 'og:title', content: 'BCA Project Sathi Blog' });
    this.meta.updateTag({ property: 'og:description', content: 'Explore our blog for insights, updates, and stories from the BCA Project Sathi community.' });
  }

  ngOnInit() {
    this.posts$ = this.blogService.getAllPosts();
    this.setMeta();
  }

  formatDate(date: Date): string {
    return format(date, 'MMM dd, yyyy');
  }

  protected readonly HTMLImageElement = HTMLImageElement;

  fallbackImage: string =
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face';

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }

}
