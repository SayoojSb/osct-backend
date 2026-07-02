# Contribloom — Backend

> RESTful API server for Contribloom — From confusion to contribution. A guided learning scaffold that reduces beginner confusion in open source.

**Vision:** A guided learning scaffold that reduces beginner confusion in open source — providing the API backbone for structured, beginner-friendly open source onboarding.

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0.0-13AA52?logo=mongodb)](https://www.mongodb.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=json-web-tokens)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?logo=render)](https://osct-backend-1.onrender.com)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Contribloom Backend** is the core API server that powers the Contribloom application. It handles:

✅ User authentication (JWT & GitHub OAuth)  
✅ Contribution CRUD operations  
✅ Advanced search, filtering, and sorting  
✅ GitHub API integration  
✅ Data persistence with MongoDB  
✅ Secure token management  

**Frontend Repository:** [osct-frontend](https://github.com/SayoojSb/osct-frontend)

---

## Features

### Authentication
- **Email & Password Authentication** with JWT tokens
- **GitHub OAuth Integration** for seamless sign-up
- **Secure Password Hashing** with bcrypt
- **Token-based Session Management**
- **CORS Protection** for cross-origin requests

### Contribution Management
- **Create** new contributions with full details
- **Read** all contributions with pagination
- **Update** contribution information
- **Update** PR status independently
- **Delete** contributions with ownership verification
- **Ownership Security** - Only creators can modify their contributions

### Advanced Features
- **Search** by title and repository name
- **Filter** by PR status (open, closed, merged)
- **Filter** by difficulty level (easy, medium, hard)
- **Sort** by date (latest/oldest) or alphabetically
- **Pagination** for efficient data loading
- **GitHub API Integration** for repository data

### GitHub Integration
- Fetch organization repositories
- Retrieve PR information
- Real-time status updates
- Direct GitHub API communication

---

## Tech Stack

```
Runtime:        Node.js
Framework:      Express 5.1.0
Database:       MongoDB 7.0.0
ODM:            Mongoose 8.20.0
Authentication: JWT (jsonwebtoken 9.0.2)
Password Hash:  Bcrypt 6.0.0
HTTP Client:    Axios 1.13.3
CORS:           CORS 2.8.5
Environment:    Dotenv 17.2.3
Dev Tools:      Nodemon 3.1.11
```

---

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- GitHub OAuth credentials (optional)

### Clone & Setup

```bash
# Clone repository
git clone https://github.com/SayoojSb/osct-backend.git
cd osct-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/osct

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
SESSION_SECRET=your_session_secret_key_here

# Server
PORT=3000
NODE_ENV=development

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# URLs
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# GitHub API
GITHUB_TOKEN=your_github_personal_access_token
```

### Getting Credentials

**MongoDB Atlas:**
1. Create account at [mongodb.com](https://www.mongodb.com)
2. Create cluster and get connection string
3. Add `MONGO_URL` to .env

**GitHub OAuth:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Get Client ID and Client Secret
4. Set Authorization callback URL to `http://localhost:3000/api/auth/github/callback`

**GitHub Token:**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` scope
3. Add to `GITHUB_TOKEN`

---

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 201 Created
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com"
  }
}
```

#### GitHub OAuth
```http
GET /api/auth/github
Redirects to GitHub authorization page

GET /api/auth/github/callback?code=xxx&state=yyy
Redirects to frontend with token
```

### Contribution Routes (`/api/contributions`)

#### Create Contribution
```http
POST /api/contributions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Fix typo in README",
  "repository": "awesome-project",
  "prLink": "https://github.com/user/repo/pull/123",
  "description": "Fixed spelling errors in documentation",
  "status": "open",
  "difficulty": "easy"
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Fix typo in README",
  "repository": "awesome-project",
  "prLink": "https://github.com/user/repo/pull/123",
  "description": "Fixed spelling errors in documentation",
  "status": "open",
  "difficulty": "easy",
  "createdBy": "507f1f77bcf86cd799439012",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### Get All Contributions
```http
GET /api/contributions?page=1&limit=10&search=react&status=open&difficulty=medium&sort=latest
Authorization: Bearer <token>

Response: 200 OK
{
  "contributions": [...],
  "totalCount": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

#### Get Single Contribution
```http
GET /api/contributions/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Fix typo in README",
  ...
}
```

#### Update Contribution
```http
PUT /api/contributions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "merged",
  "difficulty": "medium"
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Updated title",
  ...
}
```

#### Update PR Status Only
```http
PATCH /api/contributions/status/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "merged"
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "merged",
  ...
}
```

#### Delete Contribution
```http
DELETE /api/contributions/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Contribution deleted successfully"
}
```

### Query Parameters

```
GET /api/contributions?
  page=1              # Page number (default: 1)
  limit=10            # Items per page (default: 10)
  search=react        # Search by title or repo
  status=open         # Filter: open, closed, merged
  difficulty=medium   # Filter: easy, medium, hard
  sort=latest         # Sort: latest, oldest, titleAZ, titleZA
```

---

## Project Structure

```
osct-backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js       # Auth logic
│   │   ├── contributionController.js # CRUD logic
│   │   └── github.controller.js    # GitHub API logic
│   │
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   └── Contribution.js         # Contribution schema
│   │
│   ├── routes/
│   │   ├── auth.routes.js          # Auth endpoints
│   │   ├── contributions.routes.js # Contribution endpoints
│   │   └── github.routes.js        # GitHub endpoints
│   │
│   ├── middlewares/
│   │   └── authMiddleware.js       # JWT verification
│   │
│   ├── services/
│   │   ├── authService.js          # Auth business logic
│   │   └── contributionService.js  # Contribution logic
│   │
│   ├── utils/
│   │   ├── generateToken.js        # JWT generation
│   │   └── githubClient.js         # GitHub API client
│   │
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   │
│   ├── app.js                      # Express app setup
│   └── server.js                   # Server entry point
│
├── .env                            # Environment variables
├── .env.example                    # Example env file
├── package.json
└── README.md
```

---

## Authentication Flow

### JWT Authentication
```
Client Request
    ↓
Authorization Header: Bearer <token>
    ↓
authMiddleware.js verifies token
    ↓
Token valid? → Yes → Proceed to route
           → No → Return 401 Unauthorized
```

### GitHub OAuth Flow
```
User clicks "Login with GitHub"
    ↓
Redirect to /api/auth/github
    ↓
Backend redirects to GitHub
    ↓
User authorizes app
    ↓
GitHub redirects to /api/auth/github/callback
    ↓
Backend exchanges code for access token
    ↓
Backend creates JWT
    ↓
Redirect to frontend with token
    ↓
Frontend stores token in localStorage
```

---

## Deployment

### Deploy to Render

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect GitHub repository
   - Set environment variables in Render dashboard

3. **Configure Environment Variables**
   - Add all `.env` variables in Render dashboard
   - Ensure `BACKEND_URL` matches Render deployment URL
   - Ensure `FRONTEND_URL` matches frontend deployment URL

4. **Deploy**
   - Render auto-deploys on push to main
   - Monitor deployment logs

**Live URL:** https://osct-backend-1.onrender.com

---

## Testing

### Test with cURL

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get all contributions (replace TOKEN with actual JWT)
curl -X GET http://localhost:3000/api/contributions \
  -H "Authorization: Bearer TOKEN"
```

### Test Credentials

```
Email: sa@mail.com
Password: letsgo123
```

---

## Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'feat: add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Code Style
- Use meaningful variable names
- Add comments for complex logic
- Follow existing patterns
- Test before submitting PR

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Contributors

- **Sayooj SB** - Backend Developer
  - GitHub: [@SayoojSb](https://github.com/SayoojSb)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/SayoojSb/osct-backend/issues)
- **Frontend Repo:** [osct-frontend](https://github.com/SayoojSb/osct-frontend)
- **Main Project:** [Contribloom](https://github.com/SayoojSb/osct)

---

<div align="center">

**Made with ❤️ by developers, for developers**

[⬆ Back to Top](#-contribloom--backend)

</div>
