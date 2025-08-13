import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Observable} from "rxjs";
import {BlogPost} from "../../core/models/blog.model";
import {BlogService} from "../../core/services/blog.service";
import { format } from 'date-fns';


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

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.posts$ = this.blogService.getAllPosts();
  }

  formatDate(date: Date): string {
    return format(date, 'MMM dd, yyyy');
  }
}
