# Expense Manager

A static expense and income manager built for GitHub Pages. The interface is in Hebrew with RTL layout, and all data is stored locally in the browser using `localStorage`, so no server or database is required.

[![Live Demo](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-0d6efd?style=for-the-badge)](https://samuelsion.github.io/Expense-Manager/)

## Highlights

- Purpose-built for personal and business finance tracking
- Clean RTL interface with clear navigation and large content areas
- Hosted publicly on GitHub Pages for easy sharing
- Stores all user data locally in the browser

## Live Demo

- GitHub Pages: https://samuelsion.github.io/Expense-Manager/

## Accessibility & UX

- Hebrew interface with RTL layout for natural reading flow
- Clear page structure with separate home, filters, reports, and about pages
- Large, visible sections for summary cards, forms, and tables
- Responsive layout that works well on desktop and mobile screens
- Public hosting on GitHub Pages for fast access and easy sharing

## Pages

- `index.html` - home page and record management
- `filters.html` - data filtering
- `reports.html` - reports and analytics
- `about.html` - project information

## Technologies

- HTML5
- CSS3
- Bootstrap 5
- JavaScript ES6+
- Chart.js
- Fetch API
- async/await
- Bootstrap Icons

## Implementation Notes

- Local Storage for client-side persistence
- JSON for serializing and loading data
- IIFE and modular JavaScript structure
- Arrow Functions, `addEventListener`, and Event Delegation
- Map and Set for efficient lookups and category handling
- DOM manipulation for rendering forms, tables, and summaries
- Claude and Gemini were used to help shape the documentation and presentation

## How to Run

1. Open `index.html` in a browser.
2. You can also use a local static server if you prefer a smoother development workflow.

## Folder Structure

```text
Expense Manager/
├── about.html
├── filters.html
├── index.html
├── reports.html
├── css/
│   └── style.css
├── images/
└── js/
    ├── app.js
    ├── filters.js
    ├── home.js
    └── reports.js
```

## Notes

- Data is stored only on the client side
- Market and currency data depends on internet access and third-party services