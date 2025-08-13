import { Injectable } from '@angular/core';
import {BlogPost} from "../models/blog.model";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor() { }

  getAllPosts(): Observable<BlogPost[]> {
    return of(this.mockPosts);
  }

  getPostBySlug(slug: string): Observable<BlogPost | undefined> {
    const post = this.mockPosts.find(p => p.slug === slug);
    return of(post);
  }

  getPostsByTag(tag: string): Observable<BlogPost[]> {
    const filtered = this.mockPosts.filter(post =>
      post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
    return of(filtered);
  }

  private mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'A Complete Guide to Angular Signals',
      excerpt: 'Learn how to use Angular Signals to manage reactive state with less boilerplate and better performance.',
      content: `
# A Complete Guide to Angular Signals

Angular Signals provide a reactive way to manage application state with **fine-grained change detection**.

> "Signals are like variables that remember their past and tell you when they change."

## Defining a Signal

\`\`\`typescript
import { signal } from '@angular/core';

export class CounterComponent {
  count = signal(0);

  increment() {
    this.count.set(this.count() + 1);
  }
}
\`\`\`

## Computed Signals

You can derive new values from existing signals:

\`\`\`typescript
import { computed } from '@angular/core';

doubleCount = computed(() => this.count() * 2);
\`\`\`

## Comparing Signals vs RxJS

| Feature          | Signals     | RxJS Observables |
|------------------|------------|------------------|
| Push-based       | ✅         | ✅               |
| Pull-based       | ✅         | ❌               |
| Lazy evaluation  | ✅         | ❌               |
| Operators        | Limited    | Extensive        |

## Best Practices
1. Keep signals **local** to components unless shared.
2. Use **computed** for derived values.
3. Avoid mixing too much with RxJS unless necessary.

## Conclusion
Signals can simplify state management in Angular apps, making them faster and easier to maintain.
    `,
      author: 'Utsab Dahal',
      publishedDate: new Date('2024-02-15'),
      readingTime: 5,
      thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Angular', 'Signals', 'State Management'],
      slug: 'guide-to-angular-signals'
    },
    {
      id: '2',
      title: 'Mastering Async Programming in JavaScript',
      excerpt: 'Deep dive into promises, async/await, and advanced asynchronous patterns for building responsive web applications.',
      content: `
# Mastering Async Programming in JavaScript

Asynchronous programming is fundamental to modern JavaScript development. Understanding how to effectively handle async operations is crucial for building responsive, performant applications.

## Understanding the Event Loop

JavaScript's event loop is the foundation of its asynchronous nature:

\`\`\`javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');
// Output: Start, End, Promise, Timeout
\`\`\`

## Promises and Async/Await

### Promise Basics
\`\`\`javascript
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Data fetched successfully');
    }, 1000);
  });
};

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

### Async/Await Syntax
\`\`\`javascript
const fetchDataAsync = async () => {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
\`\`\`

## Advanced Patterns

### Parallel Execution
\`\`\`javascript
const fetchMultipleData = async () => {
  try {
    const [users, posts, comments] = await Promise.all([
      fetchUsers(),
      fetchPosts(),
      fetchComments()
    ]);
    return { users, posts, comments };
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};
\`\`\`

### Error Handling Strategies
\`\`\`javascript
const robustFetch = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
\`\`\`

## Best Practices
1. **Always handle errors** in async operations
2. **Use Promise.all** for parallel operations
3. **Avoid callback hell** with promises/async-await
4. **Be mindful of performance** implications

## Conclusion
Mastering async programming in JavaScript opens up possibilities for creating highly responsive and efficient applications.
    `,
      author: 'Utsab Dahal',
      publishedDate: new Date('2024-01-10'),
      readingTime: 6,
      thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['JavaScript', 'Async', 'Promises', 'Programming'],
      slug: 'mastering-async-programming-javascript'
    },
    {
      id: '3',
      title: 'Building Responsive Layouts with CSS Grid',
      excerpt: 'Learn how to use CSS Grid to create powerful, responsive layouts without heavy frameworks.',
      content: `
# Building Responsive Layouts with CSS Grid

CSS Grid is a two-dimensional layout system that gives you control over rows and columns.

> "Once you go Grid, you never go back."

## Basic Grid Layout

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}
\`\`\`

HTML:
\`\`\`html
<div class="container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>
\`\`\`

## Responsive Grid with Media Queries

\`\`\`css
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}
\`\`\`

## CSS Grid vs Flexbox

| Feature             | CSS Grid  | Flexbox  |
|---------------------|-----------|----------|
| Direction           | 2D        | 1D       |
| Content Reordering  | Easy      | Harder   |
| Alignment Options   | Extensive | Good     |

## Best Practices
- Use Grid for **page-level layouts**.
- Use Flexbox for **component-level alignment**.
- Combine both for powerful designs.

## Conclusion
CSS Grid empowers you to create responsive, flexible, and clean layouts without heavy CSS frameworks.
    `,
      author: 'Utsab Dahal',
      publishedDate: new Date('2024-03-05'),
      readingTime: 4,
      thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['CSS', 'Grid', 'Web Design'],
      slug: 'responsive-layouts-css-grid'
    }
  ];

}
