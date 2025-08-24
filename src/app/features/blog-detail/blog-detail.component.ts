import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AsyncPipe, isPlatformBrowser, NgForOf, NgIf} from "@angular/common";
import {map, Observable, of, switchMap} from "rxjs";
import {BlogPost, TableOfContentsItem} from "../../core/models/blog.model";
import {BlogService} from "../../core/services/blog.service";
import { Clipboard } from '@angular/cdk/clipboard';
import {format} from "date-fns";
import {MarkdownComponent} from "ngx-markdown";
import {Meta, Title} from "@angular/platform-browser";
import Prism from 'prismjs';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    NgForOf,
    NgIf,
    MarkdownComponent
  ],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent implements OnInit {
  post$!: Observable<BlogPost | undefined>;
  tableOfContents: TableOfContentsItem[] = [];
  activeSection: string = '';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private clipboard: Clipboard,
    @Inject(PLATFORM_ID) private platformId: Object,
    private meta: Meta,
    private title: Title
  ) {}

  setMeta(post: BlogPost) {
    const title = post.seoTitle || post.title;
    const description = post.seoDescription || post.excerpt;
    const keywords = post.seoKeywords?.join(', ') || '';
    const url = window.location.href;
    const image = post.thumbnail;

    this.title.setTitle(`${title} | BCA Project Sathi Blog`);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical link (optional, if you want to set it dynamically)
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  ngOnInit() {
    this.post$ = this.route.paramMap.pipe(
      map(params => params.get('slug')),
      switchMap(slug => slug ? this.blogService.getPostBySlug(slug) : of(undefined))
    );

    this.post$.subscribe(post => {
      if (post) {
        setTimeout(() => this.generateTableOfContents(), 100);
        this.setMeta(post);
      }
    });

  }

  formatDate(date: Date): string {
    return format(date, 'MMMM dd, yyyy');
  }

  onMarkdownReady() {
    setTimeout(() => {
      this.generateTableOfContents();
      this.enhanceCodeBlocks();
    }, 100);
  }

  generateTableOfContents() {
    if(isPlatformBrowser(this.platformId)) {

      const headings = document.querySelectorAll('.article-content h1, .article-content h2, .article-content h3');
      this.tableOfContents = [];

      headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;

        const level = parseInt(heading.tagName.charAt(1));
        const title = heading.textContent || '';

        this.tableOfContents.push({
          id,
          title,
          level
        });
      });

      this.setupScrollSpy();
    }
  }

  enhanceCodeBlocks() {
    if (!isPlatformBrowser(this.platformId)) return;
    const codeBlocks = document.querySelectorAll('.article-content pre code');

    codeBlocks.forEach((codeBlock, _index) => {
      const pre = codeBlock.parentElement as HTMLPreElement;
      if (!pre) return;

      // Get language from class name
      const className = codeBlock.className;
      const languageMatch = className.match(/language-(\w+)/);
      const language = languageMatch ? languageMatch[1] : 'text';

      // Count lines to determine if scrolling is needed
      const codeText = codeBlock.textContent || '';
      const lineCount = codeText.split('\n').length;
      const isLongCode = lineCount > 10;

      // Create wrapper div
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      wrapper.style.cssText = `
        position: relative;
        margin: 2rem 0;
        border-radius: 12px;
        overflow: hidden;
        background: #1e1e1e;
        border: 1px solid #333;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      `;

      // Create header with language and copy button
      const header = document.createElement('div');
      header.className = 'code-block-header';
      header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, #2d2d2d, #1e1e1e);
        padding: 0.75rem 1.5rem;
        border-bottom: 1px solid #333;
      `;

      // Language label
      const languageLabel = document.createElement('span');
      languageLabel.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 0.5rem;">
          <polyline points="16,18 22,12 16,6"></polyline>
          <polyline points="8,6 2,12 8,18"></polyline>
        </svg>
        ${language.toUpperCase()}
      `;
      languageLabel.style.cssText = `
        display: flex;
        align-items: center;
        color: #569cd6;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        font-family: 'JetBrains Mono', monospace;
      `;

      // Line count indicator for long code
      if (isLongCode) {
        const lineIndicator = document.createElement('span');
        lineIndicator.textContent = `${lineCount} lines`;
        lineIndicator.style.cssText = `
          color: #6a9955;
          font-size: 0.7rem;
          margin-left: 1rem;
          opacity: 0.8;
        `;
        languageLabel.appendChild(lineIndicator);
      }

      // Copy button
      const copyButton = document.createElement('button');
      copyButton.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
      `;
      copyButton.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #007acc;
        border: none;
        border-radius: 6px;
        color: white;
        cursor: pointer;
        font-size: 0.75rem;
        padding: 0.5rem 0.75rem;
        transition: all 0.2s ease;
        font-weight: 500;
        font-family: inherit;
        box-shadow: 0 2px 4px rgba(0, 122, 204, 0.3);
      `;

      copyButton.addEventListener('mouseenter', () => {
        copyButton.style.background = '#005a9e';
        copyButton.style.transform = 'translateY(-1px)';
        copyButton.style.boxShadow = '0 4px 8px rgba(0, 122, 204, 0.4)';
      });

      copyButton.addEventListener('mouseleave', () => {
        copyButton.style.background = '#007acc';
        copyButton.style.transform = 'translateY(0)';
        copyButton.style.boxShadow = '0 2px 4px rgba(0, 122, 204, 0.3)';
      });

      copyButton.addEventListener('click', () => {
        const code = codeBlock.textContent || '';
        this.clipboard.copy(code);

        // Visual feedback
        const originalContent = copyButton.innerHTML;
        copyButton.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
          Copied!
        `;
        copyButton.style.background = '#10b981';
        copyButton.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.3)';

        setTimeout(() => {
          copyButton.innerHTML = originalContent;
          copyButton.style.background = '#007acc';
          copyButton.style.boxShadow = '0 2px 4px rgba(0, 122, 204, 0.3)';
        }, 2000);
      });

      header.appendChild(languageLabel);
      header.appendChild(copyButton);

      // Update pre styles
      pre.style.cssText = `
        margin: 0 !important;
        border-radius: 0 !important;
        background: #1e1e1e !important;
        color: #d4d4d4 !important;
        padding: 1.5rem !important;
        overflow: auto !important;
        max-height: ${isLongCode ? '400px' : 'none'} !important;
        font-size: 0.9rem !important;
        line-height: 1.6 !important;
        font-family: 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
        border: none !important;
      `;

      // Add scrollbar styling for long code blocks
      if (isLongCode) {
        const style = document.createElement('style');
        style.textContent = `
          .code-block-wrapper pre::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .code-block-wrapper pre::-webkit-scrollbar-track {
            background: #2d2d2d;
            border-radius: 4px;
          }
          .code-block-wrapper pre::-webkit-scrollbar-thumb {
            background: #569cd6;
            border-radius: 4px;
          }
          .code-block-wrapper pre::-webkit-scrollbar-thumb:hover {
            background: #4fc3f7;
          }
        `;
        document.head.appendChild(style);
      }

      // Insert wrapper and move elements
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
    Prism.highlightAll();
  }

  setupScrollSpy() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0.1
      }
    );

    this.tableOfContents.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });
  }

  scrollToSection(sectionId: string, event: Event) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  fallbackImage: string =
    'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop&crop=face';

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }
}
