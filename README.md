# Expense Manager

A static web app for managing expenses and income. The interface is built in Hebrew with RTL layout, and all data is stored locally in the browser using `localStorage`, so no server or database is required.

## Features

- Add, edit, and delete expenses and income entries
- Summary cards for expenses, income, balance, and record count
- Filtering and reporting screens
- Market and currency data on the home page
- Responsive UI built with Bootstrap

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