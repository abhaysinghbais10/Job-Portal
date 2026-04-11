# 🚀 JobPortal – Full-Stack MERN Job Portal Web Application

A professional, full-stack Job Portal built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Features a modern UI with Tailwind CSS, JWT authentication, job listings with search & filter, job application flow, and application status tracking.

---

## ✨ Features

- 🔐 **Authentication** – JWT-based register/login with bcrypt password hashing
- 🏠 **Landing Page** – Hero section, job categories, featured listings, stats
- 📋 **Job Dashboard** – Search, filter by category/type, paginated listings
- 📄 **Job Details** – Full job info, requirements, tech stack
- 💼 **Job Application** – Form with resume upload (PDF/DOC/DOCX), cover letter
- 📊 **Application Status** – Track application progress with visual steps
- 🔒 **Protected Routes** – Dashboard & application pages require login
- 📱 **Fully Responsive** – Works on mobile, tablet, and desktop
- 🍞 **Toast Notifications** – Instant feedback for all actions
- 🌱 **Auto-seeded Jobs** – Sample job data added on first run

---

## 🗂️ Project Structure

```
Job-Portal/
├── backend/                  # Node.js + Express API
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   └── auth.js           # JWT auth middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   └── applications.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/                 # React.js + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── ApplyJob.jsx
│   │   │   └── ApplicationStatus.jsx
│   │   ├── utils/
│   │   │   └── api.js        # Axios instance
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- npm or yarn

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/abhaysinghbais10/Job-Portal.git
cd Job-Portal
```

---

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The backend will start on **http://localhost:5000**. Sample jobs are auto-seeded on first run.

---

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend will be available at **http://localhost:5173**.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Jobs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/jobs` | Get all jobs (with search/filter) | Public |
| GET | `/api/jobs/:id` | Get single job | Public |
| POST | `/api/jobs` | Create a job | Admin |
| PUT | `/api/jobs/:id` | Update a job | Admin |
| DELETE | `/api/jobs/:id` | Delete a job | Admin |

**Query params for GET /api/jobs:** `search`, `category`, `type`, `location`, `page`, `limit`

### Applications
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/applications` | Apply for a job | Private |
| GET | `/api/applications/my` | Get my applications | Private |
| GET | `/api/applications` | Get all applications | Admin |
| PUT | `/api/applications/:id/status` | Update status | Admin |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Notifications | React Hot Toast |
| Icons | React Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| File Upload | Multer |

---

## 🔐 Security Features

- Passwords hashed with **bcryptjs** (12 salt rounds)
- JWT tokens with 7-day expiration
- Protected API routes via auth middleware
- File upload validation (type & size limits)
- Duplicate application prevention

---

## 📸 Pages

| Page | Description |
|------|-------------|
| Landing | Hero, categories, featured jobs |
| Dashboard | Job listings with search & filters |
| Job Details | Full job info + apply button |
| Apply | Application form with resume upload |
| My Applications | Status tracking with progress steps |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using the MERN Stack