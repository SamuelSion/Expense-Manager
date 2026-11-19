# 💰 Expense Manager

> A static expense and income manager with filters, reports and charts.  
> Built with vanilla **HTML**, **CSS** & **JavaScript** and **Bootstrap 5** — no backend, no database.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![LocalStorage](https://img.shields.io/badge/Storage-localStorage-blue)
[![Live Demo](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-0d6efd)](https://samuelsion.github.io/Expense-Manager/)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Record Management** | Add and manage personal or business income and expense records from the home page |
| **Filters** | A dedicated page for filtering the recorded data |
| **Reports & Charts** | Analytics and visual summaries rendered with Chart.js |
| **Persistent Storage** | All data is saved to `localStorage` — it survives page refresh and browser restarts |
| **Hebrew RTL Interface** | Full right-to-left layout with clear navigation and large content areas |
| **Responsive** | Works on desktop and mobile screens |

---

## 🖥️ Demo

**Live:** https://samuelsion.github.io/Expense-Manager/

> To run locally: clone the repo and open `index.html`, or use Live Server in VS Code.

---

## 📄 Pages

| Page | Purpose |
|------|---------|
| `index.html` | Home page and record management |
| `filters.html` | Data filtering |
| `reports.html` | Reports and analytics |
| `about.html` | Project information |

---

## 🏗️ Architecture

```
Expense Manager/
├── index.html        # Home — record management
├── filters.html      # Filtering page
├── reports.html      # Reports and charts
├── about.html        # About page
├── css/
│   └── style.css     # Styling
├── js/
│   ├── app.js
│   ├── home.js       # Home page
│   ├── filters.js    # Filters page
│   └── reports.js    # Reports page
├── images/
└── README.md
```

**Separation of concerns** — markup, styling and logic are split, and every page has its own script.

---

## 🔧 Technical Highlights

- **Client-side persistence** — `localStorage` with JSON serialization of the records
- **Modular JavaScript** — IIFE structure keeps each page's scope isolated
- **Modern ES6+** — arrow functions, `addEventListener` and event delegation
- **Efficient lookups** — `Map` and `Set` for category handling
- **Async data** — Fetch API with `async` / `await` for external market and currency data
- **DOM rendering** — forms, tables and summaries are built dynamically
- **Charts** — Chart.js for the reports page
- **UI kit** — Bootstrap 5 and Bootstrap Icons
- **RTL Support** — full right-to-left Hebrew interface

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/SamuelSion/Expense-Manager.git

# Open
cd Expense-Manager
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

No build step and no server are required. A local static server also works if you prefer it.

---

## 📝 Notes

- Data is stored only in the browser, so it is not shared between devices or browsers
- Market and currency data depends on internet access and third-party services
- Claude and Gemini were used to help shape the documentation and presentation

---

## 👤 Author

**Samuel Sion** — [github.com/SamuelSion](https://github.com/SamuelSion)
