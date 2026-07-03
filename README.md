# Civix - Civic Engagement & Petition Platform

Civix is a web-based community engagement platform designed to bridge the gap between citizens and local government/officials. It empowers citizens to voice concerns, start petitions, vote on community polls, and generate dynamic analytics, while enabling officials to track public sentiment, manage petition lifecycles, and gather actionable data.

---

## 🚀 Key Features

### 👤 Citizen Access
* **Interactive Dashboard**: View key statistics, overall trends, active petitions, and pending polls.
* **Petition Portal**:
  * **Create Petitions**: Fill out details including category, description, and target signature count.
  * **Sign Petitions**: Search, filter by category/status, and support active petitions with digital signatures.
  * **Interactive Comments**: Share feedback and discuss petition contents.
* **Civic Polls**: Cast votes on critical community questions with immediate visualization of results.
* **Verification Request**: Submit a request to become a verified citizen.
* **Report Generation**: Export petition progress, signee details, and trends to PDF or CSV format.
* **Profile & Settings**: Manage personal profiles, change passwords, and configure notification preferences.

### 🏛️ Official Portal
* **Lifecycle Management**:
  * View pending petition submissions.
  * Review, approve, and move petitions to "Under Review".
  * Resolve petitions with official statements.
  * Delete inappropriate or violating petitions.
* **Poll Creation**: Launch community-wide polls to gather feedback on local policies and initiatives.
* **Advanced Analytics**: Monitor combined community participation trends, category-wise distributions, and vote counts.
* **Citizen Verification Dashboard**: Review pending citizen verification requests to approve or reject them.
* **Official Reports**: Download granular PDFs and CSV files of petition signatures, categories, and poll outcomes.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React 19 (Vite)
* **Styling**: TailwindCSS & Vanilla CSS
* **Animations**: Framer Motion
* **Icons**: Lucide React & React Icons
* **Charts & Analytics**: Chart.js, Recharts, React-ChartJS-2
* **PDF/CSV Processing**: jsPDF, jsPDF-AutoTable, PapaParse, React-PDF-Viewer

### Backend
* **Runtime**: Node.js & Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Authentication**: JSON Web Token (JWT) & BcryptJS (Password hashing)
* **Communications**: Nodemailer (OTP / Notification emails)

---

## 📁 Project Structure

```
Civix-Engagement-Petition-Platform/
├── README.md                 # Main Project Documentation
├── package.json              # Root Workspace Config (if applicable)
├── backend/                  # Express Backend Server
│   ├── config/               # Database Configuration (Mongoose connection)
│   ├── controllers/          # Request Handlers (Auth, Petitions, Polls, Reports, Comments)
│   ├── libs/                 # Utility Libraries (Email templates, OTP generation)
│   ├── middlewares/          # Express Middlewares (JWT Auth, Role Checking, Email Config)
│   ├── models/               # Mongoose Schemas (User, Petition, Poll, Signature, Vote, Comment)
│   ├── routes/               # API Router Endpoints
│   ├── index.js              # Server Entry Point
│   └── package.json          # Backend Dependencies & Scripts
└── civix/                    # Vite + React Frontend Application
    ├── index.html            # Main Entry HTML
    ├── vite.config.js        # Vite Config
    ├── tailwind.config.js    # Tailwind Utility Classes Setup
    ├── src/
    │   ├── App.jsx           # Main Router & Routing Config
    │   ├── main.jsx          # Application Mount Point
    │   ├── components/       # Reusable UI & Layout Components
    │   ├── pages/            # Page-Level Views (CitizenDashboard, OfficialDashboard, Reports, Settings, etc.)
    │   ├── styles/           # CSS Files
    │   └── lib/              # Client Utilities
    └── package.json          # Frontend Dependencies & Scripts
```

---

## ⚙️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)

### Step 1: Clone the Repository
```bash
git clone https://github.com/codewithmanohar/Civix-Engagement-Petition-Platform.git
cd Civix-Engagement-Petition-Platform
```

### Step 2: Configure Environment Variables

#### Backend Configuration
Create a `.env` file in the `backend/` directory:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```
*Note: Nodemailer is configured to send system emails using a default SMTP server config in `backend/middlewares/email.config.js`.*

#### Frontend Configuration
Create a `.env` file in the `civix/` directory:
```env
VITE_API_URL=http://localhost:4000/api
```

### Step 3: Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
The server will run on `http://localhost:4000`.

### Step 4: Run the Frontend Application
Open a new terminal window:
```bash
cd civix
npm install
npm run dev
```
The application will run on `http://localhost:5173`.

---

## 🔌 API Reference (Backend Endpoints)

### Authentication `/api/auth`
* `POST /register` - Register a new user (role: `citizen` or `official`).
* `POST /login` - Log in and obtain JWT.
* `POST /forgot-password` - Request a password reset OTP.
* `POST /verify-otp` - Validate OTP.
* `POST /reset-password` - Update the user password.

### Petitions `/api/petition`
* `POST /create` - Create a new petition (authenticated).
* `GET /` - Fetch all petitions.
* `GET /filter` - Search & filter petitions.
* `GET /my-signed` - Fetch petitions signed by the current user.
* `GET /:id` - Get details of a specific petition.
* `PUT /update/:id` - Update a petition.
* `POST /sign/:id` - Sign a petition.
* `GET /signature/:id` - Get signature count for a petition.
* `DELETE /delete/:id` - Delete a petition (Officials only).
* `PUT /petition/:petitionId/status` - Update petition status (Officials only).

### Polls `/api/polls`
* `POST /create` - Create a new poll.
* `GET /` - Get all active/open polls.
* `GET /my-polls` - Get polls created by the logged-in user.
* `GET /closed` - Get ended/closed polls.
* `GET /:id` - Get poll details by ID.
* `GET /:id/results` - Get real-time vote distribution.
* `PATCH /:pollId/close` - Close a poll.

### Votes `/api/vote`
* `POST /:id` - Cast a vote in a specific poll.
* `DELETE /user/:userId` - Reset user votes (Admin function).

### Comments `/api/comments`
* `GET /:id` - Get comments for a petition.
* `POST /:id` - Post a comment on a petition.
* `PUT /:commentId` - Edit a comment.
* `DELETE /:commentId` - Delete a comment.

### Citizen Verification `/api/verify`
* `POST /request` - Send verification request.
* `GET /pendings` - View pending verification requests (Officials only).
* `POST /approve/:userId` - Approve citizen verification (Officials only).
* `POST /reject/:userId` - Reject citizen verification (Officials only).

### Reports & Analytics `/api/reports`
* `GET /dashboard` - Fetch aggregate platform stats.
* `GET /petitions/categories` - Fetch category breakdown.
* `GET /polls/insights` - Fetch poll metrics.
* `GET /trends/combined` - Fetch combined trends (petitions, votes, polls).

---

## 🔒 Security & Best Practices
* **Role-Based Access Control (RBAC)**: Middlewares ensure citizens cannot access official endpoints or perform administrative duties.
* **Token Hashing & JWT**: Passwords are securely hashed with bcrypt; authentication is session-less and JWT-driven.
* **Environment Separation**: API URLs and Mongo URIs are securely loaded from env variables.