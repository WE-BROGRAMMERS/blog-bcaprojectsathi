import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogListSkeletonComponent } from './blog-list-skeleton.component';

describe('BlogListSkeletonComponent', () => {
  let component: BlogListSkeletonComponent;
  let fixture: ComponentFixture<BlogListSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogListSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogListSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
