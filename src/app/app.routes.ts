import { Routes } from '@angular/router';
import {BlogDetailComponent} from "./features/blog-detail/blog-detail.component";
import {BlogListComponent} from "./features/blog-list/blog-list.component";

export const routes: Routes = [
  { path: '', component: BlogListComponent },
  { path: 'blog/:slug', component: BlogDetailComponent },
  { path: '**', redirectTo: '' }
];
