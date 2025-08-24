export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: AuthorProfile;
  publishedDate: Date;
  readingTime: number;
  thumbnail: string;
  tags: string[];
  slug: string;
}

export interface AuthorProfile {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  created_at?: Date;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}
