# Expense Manager

A static web app for managing expenses and income. The interface is built in Hebrew with RTL layout, and all data is stored locally in the browser using `localStorage`, so no server or database is required.

[![Live Demo](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-0d6efd?style=for-the-badge)](https://samuelsion.github.io/Expense-Manager/)

## Features

- Add, edit, and delete expenses and income entries
- Summary cards for expenses, income, balance, and record count
- Filtering and reporting screens
- Market and currency data on the home page
- Responsive UI built with Bootstrap

## Live Demo

- GitHub Pages: https://samuelsion.github.io/Expense-Manager/

## Accessibility & UX

- Hebrew interface with RTL layout for natural reading flow.
- Clear page structure with separate home, filters, reports, and about pages.
- Large, visible sections for summary cards, forms, and tables.
- Hosted on GitHub Pages for fast public access and easy sharing.
- This update improves the project presentation on GitHub without changing the application code.

## Pages

- `index.html` - home page and record management
- `filters.html` - data filtering
- `reports.html` - reports and analytics
- `about.html` - project information

## Technologies

- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Bootstrap Icons

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

- Data is stored only on the client side.
- Market and currency data depends on internet access and third-party services.