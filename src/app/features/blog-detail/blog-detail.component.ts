import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AsyncPipe, isPlatformBrowser, NgForOf, NgIf} from "@angular/common";
import {map, Observable, of, Subject, switchMap, tap} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {BlogPost, TableOfContentsItem} from "../../core/models/blog.model";
import {BlogService} from "../../core/services/blog.service";
import {Clipboard} from '@angular/cdk/clipboard';
import {format} from "date-fns";
import {MarkdownComponent} from "ngx-markdown";
import {Meta, Title} from "@angular/platform-browser";
import Prism from 'prismjs';

import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';
import {BlogDetailSkeletonComponent} from "../../skeleton/blog-detail-skeleton/blog-detail-skeleton.component";

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    NgForOf,
    NgIf,
    MarkdownComponent,
    BlogDetailSkeletonComponent,
  ],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss'
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  post$!: Observable<BlogPost | undefined>;
  tableOfContents: TableOfContentsItem[] = [];
  activeSection: string = '';
  isMobileTOCOpen: boolean = false;
  private destroy$ = new Subject<void>();
  private intersectionObserver?: IntersectionObserver;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private clipboard: Clipboard,
    @Inject(PLATFORM_ID) private platformId: Object,
    private meta: Meta,
    private title: Title
  ) {}

  setMeta(post: BlogPost) {
    if(!isPlatformBrowser(this.platformId)) return;
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
    this.post$ = this.route.paramMap.pipe(
      map(params => params.get('slug')),
      switchMap(slug => slug ? this.blogService.getPostBySlug(slug) : of(undefined)),
      tap(() => this.isLoading = false), // Set loading to false when data arrives
      takeUntil(this.destroy$)
    );

    this.post$.subscribe(post => {
      if (post) {
        setTimeout(() => this.generateTableOfContents(), 100);
        this.setMeta(post);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  formatDate(date: Date): string {
    return format(date, 'MMMM dd, yyyy');
  }

  toggleMobileTOC() {
    this.isMobileTOCOpen = !this.isMobileTOCOpen;
  }

  getTOCClasses(item: TableOfContentsItem): string {
    const baseClasses = 'transition-all duration-200 hover:text-green-600';
    const levelClasses = {
      1: 'font-semibold text-gray-900',
      2: 'ml-3 text-gray-700',
      3: 'ml-6 text-gray-600'
    };
    const activeClasses = this.activeSection === item.id
      ? 'text-green-600 font-semibold border-l-2 border-green-600 pl-3 -ml-3'
      : '';

    return `${baseClasses} ${levelClasses[item.level as keyof typeof levelClasses] || 'text-gray-600'} ${activeClasses}`;
  }

  onMarkdownReady() {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      this.generateTableOfContents();
      this.enhanceCodeBlocks();
      Prism.highlightAll();
    }, 100);
  }

  generateTableOfContents() {
    if (!isPlatformBrowser(this.platformId)) return;

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
      const isLongCode = lineCount > 15;

      // Create wrapper div with Tailwind classes
      const wrapper = document.createElement('div');
      wrapper.className = 'relative my-8 rounded-2xl overflow-hidden bg-gray-900 shadow-xl ring-1 ring-gray-800';

      // Create header with language and copy button
      const header = document.createElement('div');
      header.className = 'flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700';

      // Language label with icon
      const languageLabel = document.createElement('div');
      languageLabel.className = 'flex items-center space-x-2';

      const icon = this.getLanguageIcon(language);
      const languageText = document.createElement('span');
      languageText.className = 'text-sm font-semibold text-blue-400 uppercase tracking-wider';
      languageText.textContent = language;

      languageLabel.appendChild(icon);
      languageLabel.appendChild(languageText);

      // Line count for long code
      if (isLongCode) {
        const lineIndicator = document.createElement('span');
        lineIndicator.className = 'text-xs text-green-400 ml-3 bg-green-900/30 px-2 py-1 rounded';
        lineIndicator.textContent = `${lineCount} lines`;
        languageLabel.appendChild(lineIndicator);
      }

      // Copy button with better styling
      const copyButton = document.createElement('button');
      copyButton.className = 'group flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800';

      const copyIcon = document.createElement('span');
      copyIcon.innerHTML = `
        <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;

      const copyText = document.createElement('span');
      copyText.textContent = 'Copy';

      copyButton.appendChild(copyIcon);
      copyButton.appendChild(copyText);

      copyButton.addEventListener('click', () => {
        const code = codeBlock.textContent || '';
        this.clipboard.copy(code);

        // Enhanced visual feedback
        copyIcon.innerHTML = `
          <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        `;
        copyText.textContent = 'Copied!';
        copyButton.className = copyButton.className.replace('bg-blue-600 hover:bg-blue-500', 'bg-green-600 hover:bg-green-500');

        setTimeout(() => {
          copyIcon.innerHTML = `
            <svg class="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          `;
          copyText.textContent = 'Copy';
          copyButton.className = copyButton.className.replace('bg-green-600 hover:bg-green-500', 'bg-blue-600 hover:bg-blue-500');
        }, 2000);
      });

      header.appendChild(languageLabel);
      header.appendChild(copyButton);

      // Enhanced pre styling with Tailwind
      pre.className = `
        !m-0 !bg-gray-900 !text-gray-100 !p-6 overflow-auto font-mono text-sm leading-relaxed
        ${isLongCode ? 'max-h-96' : ''}
        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800
      `.trim();

      // Apply syntax highlighting classes
      codeBlock.className = `language-${language} !bg-transparent !text-gray-100`;

      // Insert wrapper and move elements
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });

    // Apply Prism highlighting after DOM manipulation
    setTimeout(() => Prism.highlightAll(), 0);
  }

  private getLanguageIcon(language: string): HTMLElement {
    const icon = document.createElement('div');
    icon.className = 'w-4 h-4 flex items-center justify-center';

    icon.innerHTML = this.getLanguageIconSVG(language);

    return icon;
  }

  private getLanguageIconSVG(language: string): string {
    const iconMap: Record<string, string> = {
      javascript: '<svg viewBox="0 0 24 24" fill="currentColor" class="text-yellow-400"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>',
      typescript: '<svg viewBox="0 0 24 24" fill="currentColor" class="text-blue-400"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>',
      python: '<svg viewBox="0 0 24 24" fill="currentColor" class="text-green-400"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></svg>',
      css: '<svg viewBox="0 0 24 24" fill="currentColor" class="text-blue-500"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg>',
      html: '<svg viewBox="0 0 24 24" fill="currentColor" class="text-orange-500"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>',
      json: '<svg viewBox="0 0 24 24" fill="currentColor" class="text-yellow-600"><path d="M5.843 21.177l1.414-1.414a8 8 0 1 1 11.314 0l1.414 1.414A9.967 9.967 0 0 0 22 14c0-5.523-4.477-10-10-10S2 8.477 2 14a9.967 9.967 0 0 0 2.029 6.177z"/><path d="M12 2.252A11.901 11.901 0 0 0 2.05 12H5.08A8.963 8.963 0 0 1 12 5.032V2.252z"/><path d="M12 18.968A8.963 8.963 0 0 1 5.08 12H2.05A11.901 11.901 0 0 0 12 21.748v-2.78z"/><path d="M21.95 12A11.901 11.901 0 0 0 12 2.252v2.78A8.963 8.963 0 0 1 18.92 12h3.03z"/><path d="M18.92 12A8.963 8.963 0 0 1 12 18.968v2.78A11.901 11.901 0 0 0 21.95 12h-3.03z"/></svg>',
      bash: '<svg viewBox="0 0 24 24" fill="currentColor" class="text-gray-400"><path d="M21.038 4.9l-7.577-4.498c-.835-.496-1.846-.496-2.682 0L3.205 4.9C2.37 5.396 1.85 6.166 1.85 7.02v9.962c0 .854.52 1.624 1.355 2.12l7.574 4.497c.418.248.89.372 1.341.372.451 0 .923-.124 1.341-.372l7.577-4.497c.835-.496 1.355-1.266 1.355-2.12V7.02c0-.854-.52-1.624-1.355-2.12zM12 19.641l-6.804-4.043V8.402L12 4.359l6.804 4.043v7.196L12 19.641z"/><path d="M7.5 14.25l3-1.5-3-1.5v3zm6-3.75l3 1.5v-3l-3 1.5z"/></svg>',
      java: '<svg viewBox="0 0 24 24" fill="currentColor" class="text-red-500"><path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639"/></svg>'
    };

    return iconMap[language.toLowerCase()] || '<svg viewBox="0 0 24 24" fill="currentColor" class="text-gray-400"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
  }

  setupScrollSpy() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Clean up existing observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    // Observe all headings
    this.tableOfContents.forEach(item => {
      const element = document.getElementById(item.id);
      if (element && this.intersectionObserver) {
        this.intersectionObserver.observe(element);
      }
    });
  }

  scrollToSection(sectionId: string, event: Event) {
    if (!isPlatformBrowser(this.platformId)) return;

    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for fixed headers
      const elementPosition = element.offsetTop - offset;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });

      // Close mobile TOC after navigation
      this.isMobileTOCOpen = false;
    }
  }

  fallbackImage: string = '/images/blog-fallback.png';
  onImgError(event: Event) {
    if (!isPlatformBrowser(this.platformId)) return;

    const img = event.target as HTMLImageElement;
    img.src = this.fallbackImage;
  }
}
