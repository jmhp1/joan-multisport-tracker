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

All four pages (Dashboard, Meals, Evolution, Trips) are wired to the real API and Postgres, behind email/password auth (JWT, gated at the app root). Dashboard and Meals have add forms; Trips checklist items persist on toggle. Evolution is read-only (charts only — logging new metrics isn't built yet).

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
