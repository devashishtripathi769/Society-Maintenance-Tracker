# 🏢 Society Maintenance Tracker

A full-stack web application for apartment societies to manage maintenance complaints end-to-end — residents raise and track issues with photos, admins triage and resolve them through a clear status workflow, and everyone stays informed via a notice board and automated email updates.

**Stack:** React · Node.js · Express · MongoDB · JWT Auth · Multer · Nodemailer

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Guide](#setup-guide)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Docker](#docker)

---

## Features

**Residents**
- Register/login with JWT-based auth
- Raise complaints with category, description, and an optional photo
- View all their complaints with full status history (timestamp, actor, note for every change)
- Browse the notice board (important notices pinned to top)
- Receive email notifications when complaint status changes or an important notice is posted

**Admins**
- View all complaints; filter by category, status, priority, date range, or free-text search
- Set/change priority (Low / Medium / High) on any open complaint
- Update status (Open → In Progress → Resolved); every change is recorded with timestamp + optional note
- Resolved complaints are locked from further edits
- Overdue complaints (open beyond a configurable threshold) are automatically flagged and surfaced at the top
- Post notices to the board, optionally marked important (pins + emails all residents)
- Dashboard: totals by status, by category, by priority, and overdue count

---

## Tech Stack

| Layer        | Technology                                  |
|--------------|----------------------------------------------|
| Frontend     | React 18, React Router v6, plain CSS         |
| Backend      | Node.js, Express                             |
| Database     | MongoDB (Mongoose ODM)                       |
| Auth         | JWT + bcryptjs                               |
| File Upload  | Multer (disk storage)                        |
| Email        | Nodemailer (SMTP, e.g. Gmail free tier)      |
| Deployment   | Render.com / Docker                          |

---

## Project Structure

```
society-maintenance-tracker/
├── backend/
│   ├── config/
│   ├── controllers/         # (logic currently inline in routes)
│   ├── middleware/
│   │   ├── auth.js          # JWT auth + admin guard
│   │   └── upload.js        # Multer photo upload config
│   ├── models/
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   ├── Notice.js
│   │   └── Settings.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── complaints.js
│   │   ├── notices.js
│   │   └── dashboard.js
│   ├── utils/
│   │   ├── email.js         # Nodemailer templates
│   │   └── overdue.js       # Overdue detection logic
│   ├── uploads/              # Uploaded complaint photos
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Layout, Badges
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # All route pages
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
├── docker-compose.yml
├── .github/workflows/ci.yml
└── README.md
```

---

## Setup Guide

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier)
- A Gmail account (or any SMTP provider) for email notifications — optional but recommended

### 1. Clone and install

```bash
git clone https://github.com/ankit-prabhavak/society-maintenance-tracker.git
cd society-maintenance-tracker

# Backend
cd backend
npm install
cp .env.example .env   # fill in your values, see below

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

### 2. Configure environment variables

See [Environment Variables](#environment-variables) below for what each one means.

### 3. Run locally

```bash
# Terminal 1 — backend
cd backend
npm run dev          # nodemon, runs on http://localhost:5000

# Terminal 2 — frontend
cd frontend
npm start             # runs on http://localhost:3000
```

### 4. Log in as admin

A default admin account is seeded automatically on the first server start 
using the ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME values from your .env. 
Use those credentials to log in at /login — no manual database editing needed.

### 5. Windows-specific note

If you're on Windows with Node.js 18+, no special flags are needed for this project. If you hit MongoDB Atlas TLS errors on Node 22, add `--openssl-legacy-provider` to the `start` script in `backend/package.json` (this was needed in a prior project, kept here for reference).

---

## Environment Variables

### Backend (`backend/.env`)

| Variable          | Description                                              | Example                                  |
|-------------------|------------------------------------------------------------|-------------------------------------------|
| `PORT`            | Port the API server listens on                            | `5000`                                     |
| `MONGODB_URI`     | MongoDB connection string                                  | `mongodb+srv://user:pass@cluster.mongodb.net/society-maintenance` |
| `JWT_SECRET`      | Secret used to sign JWT tokens                              | any long random string                     |
| `FRONTEND_URL`    | Used for CORS                                              | `http://localhost:3000`                    |
| `EMAIL_HOST`      | SMTP host                                                  | `smtp.gmail.com`                           |
| `EMAIL_PORT`      | SMTP port                                                  | `587`                                      |
| `EMAIL_USER`      | SMTP username / sender email                                | `you@gmail.com`                            |
| `EMAIL_PASS`      | SMTP password (use a [Gmail App Password](https://myaccount.google.com/apppasswords), not your real password) | `xxxx xxxx xxxx xxxx` |
| `SOCIETY_NAME`    | Display name used in email templates                       | `Greenwood Residency`                      |

> Email is optional — if `EMAIL_USER` is not set, the app skips sending emails silently rather than failing requests.

### Frontend (`frontend/.env`)

| Variable              | Description                       | Example                          |
|-----------------------|------------------------------------|-----------------------------------|
| `REACT_APP_API_URL`   | Base URL of the backend API        | `http://localhost:5000/api`       |

---

## Database Schema

### `users`
| Field             | Type     | Notes                                  |
|-------------------|----------|------------------------------------------|
| `name`            | String   | required                                |
| `email`           | String   | required, unique, lowercase             |
| `password`        | String   | bcrypt-hashed, never returned in JSON   |
| `role`            | Enum     | `resident` \| `admin`, default `resident` |
| `apartmentNumber` | String   | optional                                |
| `phone`           | String   | optional                                |
| `createdAt/updatedAt` | Date | auto (timestamps)                       |

### `complaints`
| Field             | Type            | Notes                                          |
|-------------------|-----------------|--------------------------------------------------|
| `title`           | String          | required                                        |
| `description`     | String          | required                                        |
| `category`        | Enum            | Plumbing / Electrical / Elevator / Security / Cleaning / Parking / Noise / Internet / Other |
| `status`          | Enum            | Open / In Progress / Resolved, default `Open`   |
| `priority`        | Enum            | Low / Medium / High, default `Medium`           |
| `photo`           | String          | filename stored in `/uploads`, optional         |
| `resident`        | ObjectId → User | who raised it                                   |
| `statusHistory`   | Array           | see below — every status change is appended     |
| `isOverdue`       | Boolean         | computed on read, see overdue detection         |
| `resolvedAt`      | Date            | set when status becomes Resolved                |
| `createdAt/updatedAt` | Date        | auto (timestamps)                               |

**`statusHistory` subdocument:**
| Field        | Type            | Notes                          |
|--------------|-----------------|----------------------------------|
| `status`     | Enum            | Open / In Progress / Resolved   |
| `changedBy`  | ObjectId → User | who made the change              |
| `note`       | String          | optional admin note              |
| `timestamp`  | Date            | auto, defaults to now             |

A complaint always has at least one history entry (`Open`, "Complaint raised") created at submission time, so the full lifecycle is always reconstructable without a separate audit table.

### `notices`
| Field         | Type            | Notes                |
|---------------|-----------------|-------------------------|
| `title`       | String          | required               |
| `content`     | String          | required               |
| `isImportant` | Boolean         | default `false`, pins to top + triggers email |
| `postedBy`    | ObjectId → User | admin who posted it     |
| `createdAt/updatedAt` | Date    | auto (timestamps)       |

### `settings`
| Field   | Type    | Notes                                                   |
|---------|---------|------------------------------------------------------------|
| `key`   | String  | unique, e.g. `overdueThresholdDays`                        |
| `value` | Mixed   | currently a Number (days) — generic key/value for future config |

---

## API Documentation

Base URL: `http://localhost:5000/api`

All endpoints except `/auth/register` and `/auth/login` require a header:
```
Authorization: Bearer <jwt_token>
```

### Auth

| Method | Endpoint            | Access | Description                          |
|--------|----------------------|--------|----------------------------------------|
| POST   | `/auth/register`    | Public | Register a resident. Body: `{ name, email, password, apartmentNumber?, phone? }` |
| POST   | `/auth/login`       | Public | Login. Body: `{ email, password }`. Returns `{ token, user }` |
| GET    | `/auth/me`           | Auth   | Get the logged-in user's profile      |

### Complaints

| Method | Endpoint                                  | Access  | Description |
|--------|---------------------------------------------|---------|--------------|
| POST   | `/complaints`                              | Resident | Create a complaint. `multipart/form-data` with `title, description, category, photo?` |
| GET    | `/complaints/my`                           | Resident | Get the logged-in resident's complaints |
| GET    | `/complaints`                              | Admin   | Get all complaints. Query params: `category, status, priority, startDate, endDate, search` |
| GET    | `/complaints/:id`                          | Auth    | Get a single complaint (residents can only view their own) |
| PATCH  | `/complaints/:id`                          | Admin   | Update status/priority. Body: `{ status?, priority?, note? }`. Resolved complaints reject further updates. |
| GET    | `/complaints/settings/overdue-threshold`   | Admin   | Get current overdue threshold (days) |
| PUT    | `/complaints/settings/overdue-threshold`   | Admin   | Set overdue threshold. Body: `{ days }` |

### Notices

| Method | Endpoint          | Access  | Description |
|--------|---------------------|---------|--------------|
| GET    | `/notices`         | Auth    | Get all notices (important ones first) |
| POST   | `/notices`          | Admin   | Post a notice. Body: `{ title, content, isImportant? }`. Important notices email all residents. |
| DELETE | `/notices/:id`      | Admin   | Delete a notice |

### Dashboard

| Method | Endpoint       | Access | Description |
|--------|------------------|--------|--------------|
| GET    | `/dashboard`     | Admin  | Returns `{ total, byStatus, byCategory, byPriority, overdueCount, recentComplaints }` |

### Example: Create a complaint

```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Authorization: Bearer <token>" \
  -F "title=Leaking pipe in kitchen" \
  -F "category=Plumbing" \
  -F "description=Water has been leaking under the sink since this morning" \
  -F "photo=@/path/to/photo.jpg"
```

### Example: Update complaint status

```bash
curl -X PATCH http://localhost:5000/api/complaints/<id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress", "note": "Plumber scheduled for tomorrow 10am"}'
```

---

## Deployment

### Render.com (recommended, matches free-tier setup used previously)

**Backend (Web Service)**
1. New → Web Service → connect repo → root directory `backend`
2. Build command: `npm install`
3. Start command: `npm start`
4. Add all backend env vars from `.env.example` in the Render dashboard
5. Set `MONGODB_URI` to your MongoDB Atlas connection string (whitelist `0.0.0.0/0` or Render's IPs in Atlas Network Access)

**Frontend (Static Site)**
1. New → Static Site → connect repo → root directory `frontend`
2. Build command: `npm install && npm run build`
3. Publish directory: `build`
4. Add `REACT_APP_API_URL` pointing to your deployed backend URL + `/api`
5. Update the backend's `FRONTEND_URL` env var to your deployed frontend URL (for CORS)

### MongoDB Atlas
1. Create a free M0 cluster
2. Create a database user
3. Network Access → allow access from anywhere (`0.0.0.0/0`) for Render compatibility
4. Copy the connection string into `MONGODB_URI`

---

## Docker

A `docker-compose.yml` is provided for local containerized development:

```bash
# Ensure backend/.env is filled in first
docker compose up --build
```
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

Each service also has a standalone `Dockerfile` for independent container deployment (e.g. Render's Docker runtime, Railway, etc).

---

## CI/CD

`.github/workflows/ci.yml` runs on every push/PR to `main`: installs dependencies and verifies both the backend syntax and the frontend production build succeed.
