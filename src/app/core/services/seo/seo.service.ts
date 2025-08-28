import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  updateMeta({
               title,
               description,
               keywords,
               url,
               image,
               type = 'website'
             }: {
    title: string;
    description: string;
    keywords?: string;
    url?: string;
    image?: string;
    type?: string;
  }) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    if (keywords) this.meta.updateTag({ name: 'keywords', content: keywords });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: type });
    if (url) this.meta.updateTag({ property: 'og:url', content: url });
    if (image) this.meta.updateTag({ property: 'og:image', content: image });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    if (image) this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical link
    if (url) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    }
  }
}
