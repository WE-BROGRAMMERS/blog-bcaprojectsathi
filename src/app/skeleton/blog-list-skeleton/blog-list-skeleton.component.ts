import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-blog-list-skeleton',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './blog-list-skeleton.component.html',
  styleUrl: './blog-list-skeleton.component.scss'
})
export class BlogListSkeletonComponent {
  skeletonItems = new Array(6).fill(0);

}
