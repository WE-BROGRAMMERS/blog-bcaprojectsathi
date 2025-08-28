import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDetailSkeletonComponent } from './blog-detail-skeleton.component';

describe('BlogDetailSkeletonComponent', () => {
  let component: BlogDetailSkeletonComponent;
  let fixture: ComponentFixture<BlogDetailSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetailSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogDetailSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
