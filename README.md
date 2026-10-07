# Multisport Tracker

Personal training app covering CF/climbing/running sessions, meal logging, long-term evolution (weight, grades, times, lifts), and trip planning for objectives like Hurrungane/Jotunheimen.

## Structure

```
frontend/   React + Vite, mobile-first
  src/
    pages/       Dashboard, MealLogger, Evolution, TripPlanner, Login
    components/  SessionCard, MealCard, Chart
    context/     AuthContext (JWT in localStorage)
    api/         client.js, useApi.js
    App.jsx

backend/    Node + Express
  routes/   sessions, meals, metrics, trips, auth
  models/   User, Session, Meal, Metric, Trip
  db/       schema.sql, migrate.js, seed.js
  server.js
```

## Status

All four pages (Dashboard, Meals, Evolution, Trips) are wired to the real API and Postgres, behind email/password auth (JWT, gated at the app root). Dashboard, Meals, and Evolution have add forms; Trips checklist items persist on toggle. Not deployed yet — see Deployment below.

## Database

Tables: `users`, `training_sessions`, `meals`, `metrics`, `trips`. See [backend/db/schema.sql](backend/db/schema.sql).

```bash
cd backend
cp .env.example .env   # set DATABASE_URL + JWT_SECRET
npm install
npm run migrate
npm run seed   # optional: creates joan@example.com / training123 with sample data
```

## Local dev

```bash
# backend
cd backend && npm install && npm run dev   # http://localhost:3001

# frontend
cd frontend && npm install && npm run dev  # http://localhost:5173
```

Note: `backend/config/db.js` forces Postgres `DATE` columns to pass through as raw `'YYYY-MM-DD'` strings rather than being parsed into JS `Date` objects — `pg`'s default DATE parsing produces a local-midnight `Date`, which shifts to the previous day once JSON-serialized in any timezone ahead of UTC. Keep this in mind if you add new date-handling code.

## Deployment

Deploy the backend first — the frontend build needs its URL.

**1. Backend → Railway**
- In the Railway dashboard: New Project → Deploy from GitHub repo → select `joan-multisport-tracker`.
- Set the service's root directory to `backend`.
- Add a Postgres plugin to the project — Railway injects `DATABASE_URL` into the backend service automatically.
- Set env var `JWT_SECRET` (any long random string).
- Railway runs `npm install` then `npm start` (see `backend/railway.json`); it sets `PORT` itself, which `server.js` already respects.
- Once deployed, open a shell on the service (or run locally against the Railway `DATABASE_URL`) and run `npm run migrate`, then optionally `npm run seed`.
- Copy the service's public URL (Settings → Networking → Generate Domain if not already set).

**2. Frontend → Cloudflare Pages**
- In the Cloudflare Pages dashboard: Create a project → connect `joan-multisport-tracker`.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add a build environment variable `VITE_API_URL` set to the Railway backend URL from step 1 (e.g. `https://joan-multisport-tracker-backend.up.railway.app`) — see `frontend/.env.example`.
- Deploy. CORS on the backend is wide open (`app.use(cors())`), so no origin configuration is needed there.
