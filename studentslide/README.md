# StudentSlide 🎓

> A student-to-student marketplace for buying, selling, and trading textbooks, electronics, and other student essentials.

Built by **The Keyboard Lickers** — Gabriel Pulella, Gedeon Kazadi, Larissa Heyns & Nkanyiso Nkosi.

---

## What is StudentSlide?

StudentSlide is a full-stack web marketplace designed specifically for students. Instead of letting textbooks and electronics gather dust, students can list items they no longer need and find affordable second-hand goods from other students in their community. Every listing goes through an admin approval process to keep the platform safe and trustworthy.

---

## Features

- **Authentication** — Secure registration and login with JWT tokens and bcrypt password hashing
- **Marketplace** — Browse, search, and filter listings by category, price, or keyword
- **Listing Management** — Create, edit, and delete your own listings with image uploads
- **Admin Approval** — All listings are reviewed before going live
- **Shopping Cart** — Add and remove items from your cart
- **Messaging** — Contact sellers directly through the platform
- **Comments** — Engage with listings and ask questions
- **Protected Routes** — Certain pages are only accessible to authenticated users
- **Role-Based Access** — Normal users and admin users have different permissions
- **Responsive Design** — Works across different screen sizes and devices

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI component library |
| React Router DOM v7 | Client-side routing and protected routes |
| React Bootstrap + Bootstrap 5 | Styling and responsive layout |
| Vite | Development server and build tool |
| useState / useEffect | State management and data fetching |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express | API routing and middleware |
| MongoDB + Mongoose | Database and schema validation |
| JWT (jsonwebtoken) | User authentication tokens |
| bcrypt | Password hashing |
| CORS | Cross-origin request handling |

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/studentslide.git

# Navigate to the frontend folder
cd studentslide

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

---

### Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Install dependencies
npm install

# Create a .env file and add your environment variables (see below)

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000` by default.

---

### Environment Variables

Create a `.env` file in your backend folder with the following:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

> Never commit your `.env` file. It is already included in `.gitignore`.

---

## Project Structure

```
studentslide/
├── src/
│   ├── assets/          # Images and static files
│   ├── components/      # Reusable React components
│   ├── pages/           # Page-level components (Marketplace, Cart, Login, etc.)
│   ├── App.jsx          # Route definitions
│   └── main.jsx         # App entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint checks |

---

## User Roles

| Role | Permissions |
|---|---|
| **Normal User** | Browse listings, add to cart, create listings (pending approval), message sellers, comment |
| **Admin** | Everything a normal user can do, plus approve, remove, or delete any listing |

---

## Team

| Name | Student Number | Role |
|---|---|---|
| Gabriel Pulella | 251298 | Git Manager — Backend setup, DB, Express, JWT & bcrypt |
| Gedeon Kazadi | 21100471 | Admin Manager — Integration, frontend-backend flow |
| Larissa Heyns | 251048 | Meeting Planner — Authentication, cart, marketplace UI |
| Nkanyiso Nkosi | 251306 | Project Manager — Component building, frontend design |

---

## Contact

| Name | Email |
|---|---|
| Gabriel Pulella | 251298@virtualwindow.co.za |
| Larissa Heyns | 251048@virtualwindow.co.za |
| Gedeon Kazadi | 21100471@virtualwindow.co.za |
| Nkanyiso Nkosi | 251306@virtualwindow.co.za |