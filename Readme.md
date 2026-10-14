# Research Opportunity Portal

A full-stack web app where faculty members post, view, update, close and delete research opportunities in one place.

GitHub Repository: https://github.com/YOUR-USERNAME/research-opportunity-portal

## Tech stack
- Backend: Node.js, Express 5, Zod validation, express-rate-limit, CORS
- Database: PostgreSQL on Neon, accessed through Prisma (`@prisma/adapter-pg`)
- Frontend: React 19, React Router, Vite

## Project structure
```
backend/    Express API (routes, schemas, middleware, prisma)
frontend/   React app (pages, components, api client)
database/   Reference SQL schema
postman/    Exported Postman collection
```

## Prerequisites
- Node.js 22.18 or newer
- A free Neon account (https://neon.tech)

## 1. Database setup (Neon)
1. Create a Neon project and copy the **direct** connection string (not the one with `-pooler`).
2. In `backend/`, copy `.env.example` to `.env` and paste your string into `DATABASE_URL`.
3. Create the table:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev --name init
   ```
   This also generates the Prisma client into `backend/generated/prisma`.
   (`database/schema.sql` shows the same table as plain SQL.)

## 2. Run the backend
```bash
cd backend
npm run dev
```
The API runs at http://localhost:3000.

## 3. Run the frontend
```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:3000
npm run dev
```
Open http://localhost:5173.

## API
Base path: `/api/opportunities`

| Method | Route | Description | Success |
|---|---|---|---|
| POST | `/api/opportunities` | Create an opportunity | 201 |
| GET | `/api/opportunities` | List all (optional `?status=Open\|Closed&search=text`) | 200 |
| GET | `/api/opportunities/:id` | Get one | 200 |
| PUT | `/api/opportunities/:id` | Update any fields, including `status` | 200 |
| DELETE | `/api/opportunities/:id` | Delete | 200 |

Errors: `400` validation failed, `404` not found, `500` server error.
Every response uses the shape `{ success, message, data }`.

Fields: `title`, `description`, `researchArea`, `facultyName`, `department`, `requiredSkills`, `positions`, `deadline`, `status` (`Open` or `Closed`).

## Postman testing
Import `postman/research-opportunity-portal.postman_collection.json`, then run requests 1a to 8 in order. Ids are stored automatically. Creating requires a deadline that is not in the past, so update the sample deadlines if they have passed.

## Notes
- No credentials are committed. `.env` is git-ignored.
- Data is never hard-coded; every action goes through the API and the database.
