# StudentSlide — Frontend

> A student marketplace for buying, selling, and trading second-hand items within the student community.

---

## About the Project

StudentSlide is a full-stack web application that connects students who want to sell items they no longer need with students looking for affordable second-hand goods — textbooks, electronics, study materials, and more.

This repository contains the **React frontend**, built with Vite.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI component library |
| React Router DOM v7 | Client-side routing and navigation |
| React Bootstrap + Bootstrap 5 | UI components and responsive styling |
| Vite | Development server and build tool |
| ESLint | Code linting and quality checks |

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd studentslide
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will run at `http://localhost:5173` by default.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite development server with hot module replacement |
| `npm run build` | Build the app for production into the `dist/` folder |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |

---

## Project Structure

```
studentslide/
├── public/
├── src/
│   ├── assets/          # Images, logos, static files
│   ├── components/      # Reusable React components
│   ├── pages/           # Page-level components (Marketplace, Cart, Login, etc.)
│   └── main.jsx         # App entry point
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## Key Features

- **Authentication** — Secure user registration and login with protected routes
- **Marketplace** — Browse, search, and filter student listings
- **Listing Management** — Create, edit, and delete your own listings
- **Shopping Cart** — Add and remove items from your cart
- **Messaging** — Communicate directly with buyers and sellers
- **Comments** — Engage with listings through comments
- **Admin Dashboard** — Review and approve or reject pending listings
- **Responsive Design** — Works across desktop and mobile devices

---

## Team

| Name | Student Number | Role |
|---|---|---|
| Gabriel Pulella | 251298 | Git Manager |
| Gedeon Kazadi | 21100471 | Admin Manager |
| Larissa Heyns | 251048 | Meeting Planner |
| Nkanyiso Nkosi | 251306 | Project Manager |

---

## Backend

This frontend connects to a Node.js + Express backend with a MongoDB database. Make sure the backend server is running before starting the frontend. API requests are made to the backend to handle authentication, listings, messages, cart, and admin operations.

---

## Notes

- Environment variables (API base URL, etc.) should be stored in a `.env` file at the root. See `.gitignore` — this file is excluded from version control.
- The `dist/` folder is generated on build and is also excluded from version control.
