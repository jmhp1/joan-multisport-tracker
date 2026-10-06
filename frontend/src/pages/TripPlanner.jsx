import { useState } from 'react'
import '../styles/TripPlanner.css'

// Hardcoded sample trips — will come from GET /api/trips once the backend is wired up.
const INITIAL_TRIPS = [
  {
    name: 'Hurrungane Traverse',
    location: 'Hurrungane, Norway',
    objective: 'Skagastølstind + Store Skagastølstind ridge, 2 days',
    targetDate: '2027-07-20',
    checklist: [
      { label: 'Glacier travel refresher (crevasse rescue)', done: true },
      { label: 'Book Turtagrø hut', done: true },
      { label: 'Rope, harness, crampons, axe check', done: false },
      { label: 'Weather window confirmed (3+ clear days)', done: false },
      { label: 'Fitness: back-to-back long days in training', done: false },
    ],
  },
  {
    name: 'Jotunheimen Haute Route',
    location: 'Jotunheimen, Norway',
    objective: 'Galdhøpiggen + Glittertind, 4-day hut-to-hut',
    targetDate: '2027-08-10',
    checklist: [
      { label: 'DNT hut reservations', done: false },
      { label: 'Route plan + bail-out points', done: false },
      { label: 'Gear shakedown weekend', done: false },
    ],
  },
]

export default function TripPlanner() {
  const [trips, setTrips] = useState(INITIAL_TRIPS)

  function toggleItem(tripIndex, itemIndex) {
    setTrips((prev) =>
      prev.map((trip, ti) =>
        ti !== tripIndex
          ? trip
          : {
              ...trip,
              checklist: trip.checklist.map((item, ii) =>
                ii !== itemIndex ? item : { ...item, done: !item.done },
              ),
            },
      ),
    )
  }

  return (
    <div>
      <h1 className="page-title">Trips</h1>
      <p className="page-subtitle">Hurrungane / Jotunheimen objectives and checklists.</p>

      <div className="trip-list">
        {trips.map((trip, ti) => {
          const doneCount = trip.checklist.filter((i) => i.done).length
          return (
            <div key={trip.name} className="trip-card">
              <div className="trip-card-header">
                <h2 className="trip-name">{trip.name}</h2>
                <span className="trip-date">{trip.targetDate}</span>
              </div>
              <p className="trip-location">{trip.location}</p>
              <p className="trip-objective">{trip.objective}</p>

              <div className="trip-progress-track">
                <div
                  className="trip-progress-fill"
                  style={{ width: `${(doneCount / trip.checklist.length) * 100}%` }}
                />
              </div>
              <p className="trip-progress-label">
                {doneCount}/{trip.checklist.length} ready
              </p>

              <ul className="checklist">
                {trip.checklist.map((item, ii) => (
                  <li key={item.label} className="checklist-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleItem(ti, ii)}
                      />
                      <span className={item.done ? 'checklist-done' : ''}>{item.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
