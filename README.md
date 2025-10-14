# 🏛️ Civix – Citizen Engagement Dashboard

Civix is a modern, full-stack web platform designed to empower citizens to voice their concerns, create petitions, and participate in polls that reflect public sentiment.  
The platform bridges the gap between citizens and governance, promoting transparency, collaboration, and participatory democracy.

---

## 🚀 Features

### 🧭 Frontend
- **Responsive UI:** Built using React.js and Tailwind CSS for modern, mobile-friendly design.
- **Dynamic Dashboard:** Displays petitions, polls, and analytics in a clean interface.
- **Interactive Components:** Users can create, vote, and comment on petitions or polls.
- **Role-Based Access:** Separate dashboards for citizens and officials.
- **Animated Visuals:** Smooth UI animations using Framer Motion.

### ⚙️ Backend
- **RESTful API:** Developed using Node.js and Express.js for scalability and modularity.
- **MongoDB Database:** Stores user data, petitions, polls, and analytics efficiently.
- **MVC Architecture:** Organized with Models, Views, and Controllers for maintainability.
- **Authentication:** Secure login and signup using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Middleware:** Implements request validation, authentication, and error handling.
- **Data Visualization Support:** API endpoints for generating analytics data for charts.

---

## 🧩 Tech Stack

| Category | Technologies Used |
|-----------|-------------------|
| **Frontend** | React.js, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT, bcrypt |
| **Version Control** | Git, GitHub |
| **Visualization** | Recharts, PDF Export 

---

## 🧠 System Architecture

```text
Frontend (React + Tailwind)
        ↓
   API Requests (Axios)
        ↓
Backend (Express + Node.js)
        ↓
Controllers → Routes → Models
        ↓
   Database (MongoDB)

```

---

## 📊 Backend Overview

The backend is designed to be **modular**, **secure**, and **efficient**. It handles data processing, authentication, and admin logic.

### ⚙️ Backend Functionalities
- User authentication and role management  
- Petition and poll creation APIs  
- Analytics data endpoints for dashboard graphs  
- PDF and CSV export features  
- Admin moderation routes (approve/reject petitions)

---

## 🖌️ UI Theme

The dashboard follows a **modern minimalistic theme** with:
- **Primary Colors:** Dark Blue (#0F172A), White (#FFFFFF), and Black (#000000)
- **Accent Colors:** Gradient backgrounds and hover highlights
- **Typography:** Clean Sans-serif fonts for readability
- **Styling:** Tailwind CSS for consistency and responsiveness



## 🧑‍💻 Installation Guide

### Prerequisites
Make sure you have the following installed:
- Node.js (v16+)
- MongoDB
- Git

### Steps
```bash
# Clone the repository
git clone https://github.com/siri0551/internship_infosys_2025_civix_team_05.git

# Navigate to project directory
cd civix

# Install dependencies
npm install

# Run backend server
cd backend
npm run start

# Run frontend
cd frontend
npm run dev

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=4000
