# Multisport Tracker

Personal training app covering CF/climbing/running sessions, meal logging, long-term evolution (weight, grades, times, lifts), and trip planning for objectives like Hurrungane/Jotunheimen.

## Structure

```
frontend/   React + Vite, mobile-first
  src/
    pages/       Dashboard, MealLogger, Evolution, TripPlanner
    components/  SessionCard, MealCard, Chart
    App.jsx

backend/    Node + Express
  routes/   sessions, meals, metrics, trips, auth
  models/   User, Session, Meal, Metric, Trip
  db/       schema.sql, migrate.js
  server.js
```

## Status

Dashboard is wired up with hardcoded sample data (no backend calls yet). Meals, Evolution, and Trips are placeholder pages. The backend has routes/models scaffolded against the Postgres schema but the frontend doesn't call them yet.

## Database

Tables: `users`, `training_sessions`, `meals`, `metrics`, `trips`. See [backend/db/schema.sql](backend/db/schema.sql).

```bash
cd backend
cp .env.example .env   # set DATABASE_URL + JWT_SECRET
npm install
npm run migrate
```

## Local dev

```bash
# backend
cd backend && npm install && npm run dev   # http://localhost:3001

# frontend
cd frontend && npm install && npm run dev  # http://localhost:5173
```

## Deployment

**Frontend → Cloudflare Pages**
- Connect this repo in the Cloudflare Pages dashboard.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

**Backend → Railway**
- Connect this repo in the Railway dashboard, create a service with root directory `backend`.
- Add a Postgres plugin — Railway injects `DATABASE_URL` automatically.
- Set `JWT_SECRET` as an environment variable.
- Railway runs `npm install` then `npm start` (see `backend/railway.json`).
- Run `npm run migrate` once (via Railway shell or locally against the Railway `DATABASE_URL`) to create the tables.
