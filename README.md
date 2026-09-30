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


Job-Portal/

├── backend/ # Node.js + Express API
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── jobController.js
│ │ └── applicationController.js
│ ├── middleware/
│ │ └── auth.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Job.js
│ │ └── Application.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── jobs.js
│ │ └── applications.js
│ ├── .env.example
│ ├── package.json
│ └── server.js
│
├── frontend/ # React.js + Tailwind CSS
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ ├── utils/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── package.json
│ ├── tailwind.config.js
│ ├── postcss.config.js
│ └── vite.config.js
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md


---

# ⚡ Quick Start

```bash
git clone https://github.com/abhaysinghbais10/Job-Portal.git

cd Job-Portal

npm install

npm run dev

Application runs on:

Frontend:

http://localhost:5173

Backend:

http://localhost:5000
⚙️ Setup & Installation
Prerequisites
Node.js v18+
MongoDB (Local or MongoDB Atlas)
npm or yarn
1️⃣ Clone Repository
git clone https://github.com/abhaysinghbais10/Job-Portal.git

cd Job-Portal
2️⃣ Backend Setup
cd backend

npm install

Create .env file:

PORT=5000

MONGO_URI=mongodb://localhost:27017/jobportal

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

Start backend:

npm run dev
3️⃣ Frontend Setup
cd frontend

npm install

npm run dev

This project is developed by Abhay Singh Bais.

Built with ❤️ using the MERN Stack