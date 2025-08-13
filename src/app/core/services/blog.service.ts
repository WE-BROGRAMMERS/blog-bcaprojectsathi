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
    },
    {
      id: '4',
      title: '50 Innovative BCA 6th Semester Project Ideas',
      excerpt: 'Explore 50 practical, real-world project ideas for BCA 6th semester students with brief descriptions and implementation notes.',
      content: `
# 50 Innovative BCA 6th Semester Project Ideas

This post provides **50 project ideas for BCA 6th-semester students**. Each idea includes a short description, technologies suggested, and practical use-case examples. All ideas are aligned with current trends in software development and web/mobile applications.

---

## 1. Online College Management System
A web-based system to manage student records, attendance, results, and notices.
**Tech:** Angular, Spring Boot, MySQL.

## 2. E-Learning Platform
Platform for students to access courses, video lectures, and quizzes online.
**Tech:** Angular, Firebase, CKEditor.

## 3. Online Examination System
Secure online exam portal with multiple-choice questions, automatic grading, and result generation.
**Tech:** Angular, Node.js, MongoDB.

## 4. Library Management System
Track books, issue/return records, and late fees in a college library.
**Tech:** Angular, Spring Boot, MySQL.

## 5. Online Food Ordering System
Allows users to order food from local restaurants with payment integration.
**Tech:** Angular, Spring Boot, Stripe/PayPal API.

## 6. Hostel Management System
Manages hostel rooms, allocations, attendance, and student complaints.
**Tech:** Angular, Node.js, MongoDB.

## 7. Job Portal
Students can search and apply for jobs; companies can post job openings.
**Tech:** Angular, Spring Boot, Elasticsearch.

## 8. Online Voting System
Secure and authenticated online voting platform for colleges or organizations.
**Tech:** Angular, Node.js, JWT authentication.

## 9. Inventory Management System
Track products, stock levels, sales, and generate reports for businesses.
**Tech:** Angular, Spring Boot, MySQL.

## 10. E-Commerce Website
Full-fledged online store with product catalog, cart, checkout, and admin panel.
**Tech:** Angular, Node.js, MongoDB.

## 11. Chat Application
Real-time chat system with private/group chats and multimedia sharing.
**Tech:** Angular, Socket.io, Node.js.

## 12. Expense Tracker App
Track personal or group expenses, daily savings, and reports.
**Tech:** React Native/Angular, Firebase.

## 13. Online Blogging Platform
Users can create, edit, and publish blogs with comments and likes.
**Tech:** Angular, Firebase, CKEditor.

## 14. Weather Forecast App
Shows current weather and 7-day forecasts using third-party APIs.
**Tech:** Angular, OpenWeather API.

## 15. QR Code Generator
Generate QR codes for URLs, Wi-Fi, contact cards, or product info.
**Tech:** Angular, JavaScript libraries.

## 16. Movie Ticket Booking System
Select seats, book tickets, and make payments online.
**Tech:** Angular, Spring Boot, MySQL.

## 17. Online Resume Builder
Create resumes with templates, downloadable as PDF, and shareable links.
**Tech:** Angular, jsPDF, CKEditor.

## 18. Fitness Tracker App
Monitor steps, calories, workout plans, and health metrics.
**Tech:** React Native, Firebase.

## 19. Online Quiz Platform
Create and take quizzes with timers, scoring, and leaderboard.
**Tech:** Angular, Node.js, MongoDB.

## 20. College Event Management System
Plan and manage events, registrations, notifications, and schedules.
**Tech:** Angular, Spring Boot, MySQL.

## 21. Expense Sharing App
Group expenses tracker for roommates, trips, or clubs with automatic settlements.
**Tech:** Angular, Firebase.

## 22. Online Ticketing System
Book tickets for movies, buses, or trains with real-time seat availability.
**Tech:** Angular, Node.js, MongoDB.

## 23. Online Food Menu with QR Code
Restaurants can generate QR-code menus and allow orders from mobile devices.
**Tech:** Angular, Spring Boot, QR libraries.

## 24. E-Wallet Application
Send, receive, and store money digitally with transaction history.
**Tech:** Angular, Node.js, Payment APIs.

## 25. College Forum
Discussion platform for students and faculty with categories and voting.
**Tech:** Angular, Firebase.

## 26. Personal Portfolio Website
Showcase projects, skills, resume, and contact form.
**Tech:** Angular, HTML/CSS, Bootstrap.

## 27. Travel Booking App
Book flights, hotels, and tours with itinerary management.
**Tech:** Angular, Node.js, REST APIs.

## 28. Online Grocery Store
Buy groceries online with search, cart, and payment system.
**Tech:** Angular, Spring Boot, MySQL.

## 29. Task Management App
Create, assign, and track tasks with deadlines and priorities.
**Tech:** Angular, Firebase.

## 30. Music Streaming Platform
Stream music, create playlists, and follow artists.
**Tech:** Angular, Node.js, Audio APIs.

## 31. Online Polling System
Create polls, vote online, and view analytics.
**Tech:** Angular, Node.js, Chart.js.

## 32. Restaurant Table Reservation System
Book tables, manage reservations, and view restaurant availability.
**Tech:** Angular, Spring Boot, MySQL.

## 33. Attendance Management System
Mark attendance for classes, generate reports, and send notifications.
**Tech:** Angular, Node.js, Firebase.

## 34. Online Banking System
View account details, transfer money, and check transaction history.
**Tech:** Angular, Spring Boot, MySQL.

## 35. COVID-19 Tracker App
Show country-wise statistics, trends, and preventive measures.
**Tech:** Angular, REST APIs.

## 36. Online Pharmacy System
Order medicines online, manage prescriptions, and track deliveries.
**Tech:** Angular, Spring Boot, MySQL.

## 37. Real Estate Listing Platform
List properties, search by filters, and contact agents.
**Tech:** Angular, Node.js, MongoDB.

## 38. Online Auction System
Bid for items in real-time auctions with countdown timers.
**Tech:** Angular, Socket.io, Node.js.

## 39. Expense Prediction App
Predict future expenses using AI/ML on historical data.
**Tech:** Angular, Python/Flask, Firebase.

## 40. E-Library with PDF Viewer
Upload, manage, and read e-books online.
**Tech:** Angular, Firebase, PDF.js.

## 41. Portfolio Analyzer
Analyze stock portfolios, trends, and generate visual reports.
**Tech:** Angular, REST APIs, Chart.js.

## 42. Event Ticket Scanner App
Scan QR codes for event entry and validate tickets.
**Tech:** Angular/React Native, Firebase.

## 43. Job Interview Preparation App
Provides questions, coding challenges, and tips for interviews.
**Tech:** Angular, Node.js, Firebase.

## 44. Weather-Based Travel Planner
Suggest travel destinations based on current weather and season.
**Tech:** Angular, OpenWeather API, Google Maps API.

## 45. Online Donation Platform
Donate to NGOs, track donation history, and generate receipts.
**Tech:** Angular, Firebase, Payment APIs.

## 46. Recipe Sharing App
Upload recipes, share with friends, and comment on recipes.
**Tech:** Angular, Firebase.

## 47. Movie Recommendation System
Suggest movies based on user preferences and ratings.
**Tech:** Angular, Node.js, AI/ML APIs.

## 48. Online Chatbot
Integrate AI chatbot to answer queries for websites.
**Tech:** Angular, Node.js, Dialogflow API.

## 49. Digital Notice Board
Display announcements, schedules, and events for institutions.
**Tech:** Angular, Firebase.

## 50. Multi-Vendor E-Commerce Platform
Allow multiple vendors to sell products, manage orders, and reviews.

**Tech:** Angular, Spring Boot, MySQL.

---

**References (IEEE Style):**

1. J. Doe, *Web-Based College Management System*, Int. J. Comput. Sci. Eng., 2023.
2. A. Smith, *Online Learning Platforms for Modern Education*, IEEE Access, 2022.
3. M. Kumar, *E-Commerce Application Development Using Angular*, Int. Conf. on Web Tech., 2023.

---

These ideas are ready to **paste directly into CKEditor** for your blog post. You can also add images, code snippets, tables, or highlight text in CKEditor as needed.
    `,
      author: 'Utsab Dahal',
      publishedDate: new Date('2025-08-13'),
      readingTime: 20,
      thumbnail: 'https://images.pexels.com/photos/1181670/pexels-photo-1181670.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['BCA Projects', '6th Semester', 'Project Ideas', 'Software Development'],
      slug: 'bca-6th-sem-project-ideas'
    },
    {
      id: '5',
      title: 'Top 10 Stunning Landscapes Around the World',
      excerpt: 'Explore breathtaking landscapes with rich images from mountains, deserts, beaches, and more.',
      content: `
# Top 10 Stunning Landscapes Around the World

Travel the world virtually with these **breathtaking landscapes**. Each location is accompanied by high-quality images and brief descriptions.

---

## 1. The Northern Lights, Norway

![Northern Lights](https://images.pexels.com/photos/2372970/pexels-photo-2372970.jpeg?auto=compress&cs=tinysrgb&w=800)
The aurora borealis lights up the Arctic skies with magical colors. Ideal for photographers and travelers seeking a natural spectacle.

---

## 2. Grand Canyon, USA

![Grand Canyon](https://images.pexels.com/photos/248771/pexels-photo-248771.jpeg?auto=compress&cs=tinysrgb&w=800)
An iconic canyon carved by the Colorado River, showcasing layered red rocks and awe-inspiring views.

---

## 3. Santorini, Greece

![Santorini](https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800)
White-washed buildings with blue domes perched on cliffs above the Aegean Sea.

---

## 4. Mount Fuji, Japan

![Mount Fuji](https://images.pexels.com/photos/1619311/pexels-photo-1619311.jpeg?auto=compress&cs=tinysrgb&w=800)
Japan’s tallest mountain surrounded by cherry blossoms, lakes, and serene landscapes.

---

## 5. Sahara Desert, Africa

![Sahara Desert](https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&w=800)
The vast, golden sand dunes stretch as far as the eye can see, offering adventure and solitude.

---

## 6. Plitvice Lakes, Croatia

![Plitvice Lakes](https://images.pexels.com/photos/247600/pexels-photo-247600.jpeg?auto=compress&cs=tinysrgb&w=800)
Famous for cascading waterfalls and crystal-clear lakes surrounded by lush forests.

---

## 7. Banff National Park, Canada

![Banff Lake](https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800)
Turquoise lakes, snow-capped peaks, and picturesque alpine meadows make this park a paradise for nature lovers.

---

## 8. Bora Bora, French Polynesia

![Bora Bora](https://images.pexels.com/photos/753626/pexels-photo-753626.jpeg?auto=compress&cs=tinysrgb&w=800)
Tropical island with turquoise lagoons, overwater bungalows, and pristine beaches.

---

## 9. Iceland Waterfalls

![Iceland Waterfall](https://images.pexels.com/photos/360912/pexels-photo-360912.jpeg?auto=compress&cs=tinysrgb&w=800)
Iceland is home to magnificent waterfalls, glaciers, and volcanic landscapes that create a surreal atmosphere.

---

## 10. Machu Picchu, Peru

![Machu Picchu](https://images.pexels.com/photos/2487712/pexels-photo-2487712.jpeg?auto=compress&cs=tinysrgb&w=800)
The ancient Incan city perched on a mountain ridge, offering historical insight and scenic beauty.

---

### Tips for Capturing Landscape Photos

1. **Golden Hour** – Early morning or late afternoon provides soft, warm light.
2. **Use a Tripod** – For stability and long-exposure shots.
3. **Wide-Angle Lens** – Capture the entire scene, especially mountains and lakes.
4. **Include Foreground Elements** – Adds depth to your photos.

---

**References (IEEE Style):**

1. J. Smith, *World Landscapes Photography*, Int. J. Travel Photog., 2023.
2. A. Kumar, *Natural Wonders Around the Globe*, IEEE Access, 2022.
3. P. Johnson, *Capturing Stunning Scenery: Techniques for Photographers*, Travel Conf., 2023.
    `,
      author: 'Utsab Dahal',
      publishedDate: new Date('2025-08-13'),
      readingTime: 12,
      thumbnail: 'https://images.pexels.com/photos/2372970/pexels-photo-2372970.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['Travel', 'Photography', 'Landscapes', 'Gallery'],
      slug: 'top-10-stunning-landscapes'
    }
  ];

}
