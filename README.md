# osct-backend

🛠️ Open Source Contribution Tracker – Backend (OSCT Backend)

A secure, production-ready Node.js + Express + MongoDB backend that powers the OSCT platform — a tool to help developers track their open-source contributions with full CRUD, authentication, pagination, filtering, sorting, and search.

🚀 Live Backend URL
https://osct-backend-1.onrender.com

🌐 Frontend Repo & Live Link

Frontend Repository:
https://github.com/SayoojSb/osct-frontend

Live Frontend (Netlify):
👉 https://your-frontend-link.netlify.app

📌 Features (Backend)
🔐 Authentication (JWT)

Signup

Login

Protected routes

Token-based access

🧩 Contribution CRUD
Feature	Status
Create Contribution	✅
Read All + Pagination	✅
Read Single	✅
Update Full Contribution	✅
Update Only Status	✅
Delete Contribution	✅
🔎 Advanced Backend Features
Functionality	Status
Pagination	✅
Search (title/repo)	✅
Filtering (status/difficulty)	✅
Sorting (latest, oldest, title A–Z, Z–A)	✅
Ownership Validation	Only creator can update/delete
🗂️ Folder Structure
src/
 ├── app.js
 ├── server.js
 ├── config/
 │     └── db.js
 ├── controllers/
 │     └── contributionController.js
 ├── services/
 │     └── contributionService.js
 ├── middlewares/
 │     └── authMiddleware.js
 ├── models/
 │     └── User.js
 │     └── Contribution.js
 ├── routes/
       ├── authRoutes.js
       └── contributionRoutes.js

🔧 Environment Variables (.env)

Create a .env file:

MONGO_URL=your_mongo_connection_string
JWT_SECRET=your_secret
PORT=3000

📡 API Documentation
👉 BASE URL
https://osct-backend-1.onrender.com/api

🔐 AUTH ROUTES
/api/auth/signup

POST
Create a new user.

/api/auth/login

POST
Logs in a user and returns:

{
  "message": "Login successful",
  "token": "<jwt_token>",
  "user": { ... }
}

🧩 CONTRIBUTION ROUTES

All these routes require:

Authorization: Bearer <token>

1️⃣ Create Contribution

POST /api/contributions/
Body:

{
  "title": "",
  "repoName": "",
  "description": "",
  "prLink": "",
  "status": "open",
  "difficulty": "easy"
}

2️⃣ Get All Contributions

GET /api/contributions/

Query Params:

page, limit, search, status, difficulty, sort

3️⃣ Get Single Contribution

GET /api/contributions/:id

4️⃣ Update Contribution

PUT /api/contributions/:id

5️⃣ Update Status Only

PATCH /api/contributions/status/:id

Body:

{ "status": "merged" }

6️⃣ Delete Contribution

DELETE /api/contributions/:id

📄 Project Proposal (Required for Evaluation)
Project Title:
⭐ Open Source Contribution Tracker (OSCT)
1. Problem Background

Developers contributing to open-source projects face several issues:

PRs spread across many repositories

Hard to remember PR status (open/merged/closed)

No centralized dashboard

No tracking of difficulty or repo names

Hard to check progress over time

This creates confusion, poor organization, and difficulty preparing portfolios or resumes.

2. Proposed Solution

OSCT provides a central dashboard for developers to:

⭐ Track Contributions:

Title

Repository

Description

PR link

Status

Difficulty

⭐ Manage Contributions:

Add

Edit

Delete

View single

View all

Update status

⭐ Analyze:

Search

Filter

Sort

Pagination

3. Target Users

Students contributing to open source

Developers with multiple PRs

Hackathon participants

Anyone maintaining a GitHub portfolio

4. Why This Is Useful

Clean contribution history

Easy for interviews

Encourages consistent contribution

Centralized visibility of developer growth

5. Tech Stack

Backend:

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

6. Scope

Includes:

Full MERN CRUD

Pagination, Sorting, Filtering, Search

Authentication

Hosted on Render + Netlify

7. Future Enhancements

GitHub OAuth login

Auto-fetch PRs via GitHub API

Visual analytics dashboard

Contribution streaks calendar

🧪 How to Run Locally
1. Clone repo
git clone <repo-url>
cd osct-backend

2. Install dependencies
npm install

3. Configure environment

Create .env.

4. Start server
npm start


Server runs on:

http://localhost:3000

🎉 All Evaluation Requirements Covered
Requirement	Status
2 CREATE	✅
2 READ	✅
2 UPDATE	✅
2 DELETE	✅
Pagination	✅
Filtering	✅
Sorting	✅
Search	✅
Hosted Backend	✅
README + Proposal	✅