import { useEffect, useState } from 'react'
import { useApi } from '../api/useApi.js'
import '../styles/TripPlanner.css'

export default function TripPlanner() {
  const api = useApi()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api('/api/trips')
      .then((data) => {
        if (!cancelled) setTrips(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function toggleItem(trip, itemIndex) {
    const nextChecklist = trip.checklist.map((item, i) =>
      i !== itemIndex ? item : { ...item, done: !item.done },
    )
    // optimistic update
    setTrips((prev) => prev.map((t) => (t.id === trip.id ? { ...t, checklist: nextChecklist } : t)))
    try {
      await api(`/api/trips/${trip.id}/checklist`, { method: 'PATCH', body: { checklist: nextChecklist } })
    } catch (err) {
      setError(err.message)
      setTrips((prev) => prev.map((t) => (t.id === trip.id ? trip : t)))
    }
  }

  return (
    <div>
      <h1 className="page-title">Trips</h1>
      <p className="page-subtitle">Hurrungane / Jotunheimen objectives and checklists.</p>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <div className="placeholder-card">Loading…</div>
      ) : trips.length === 0 ? (
        <div className="placeholder-card">No trips planned yet.</div>
      ) : (
        <div className="trip-list">
          {trips.map((trip) => {
            const doneCount = trip.checklist.filter((i) => i.done).length
            return (
              <div key={trip.id} className="trip-card">
                <div className="trip-card-header">
                  <h2 className="trip-name">{trip.name}</h2>
                  <span className="trip-date">{trip.target_date?.slice(0, 10)}</span>
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
                        <input type="checkbox" checked={item.done} onChange={() => toggleItem(trip, ii)} />
                        <span className={item.done ? 'checklist-done' : ''}>{item.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
