import { useEffect, useState } from 'react'
import SessionCard from '../components/SessionCard.jsx'
import { useApi } from '../api/useApi.js'
import { toLocalISODate } from '../utils/date.js'
import '../styles/Dashboard.css'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SESSION_TYPES = ['cf', 'climbing', 'running']

function mostRecentMonday() {
  const now = new Date()
  const diff = (now.getDay() + 6) % 7
  now.setDate(now.getDate() - diff)
  now.setHours(0, 0, 0, 0)
  return now
}

function weekDates() {
  const monday = mostRecentMonday()
  return DAY_LABELS.map((label, i) => {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    return { label, iso: toLocalISODate(d) }
  })
}

function getTodayLabel() {
  const jsDay = new Date().getDay()
  return DAY_LABELS[(jsDay + 6) % 7]
}

export default function Dashboard() {
  const api = useApi()
  const todayLabel = getTodayLabel()
  const [selectedDay, setSelectedDay] = useState(todayLabel)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'cf', durationMin: 45, intensity: 6, notes: '' })
  const [saving, setSaving] = useState(false)

  const week = weekDates()

  async function loadSessions() {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/api/sessions')
      setSessions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedDate = week.find((d) => d.label === selectedDay)?.iso
  const daySessions = sessions.filter((s) => s.date.slice(0, 10) === selectedDate)

  async function handleAddSession(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await api('/api/sessions', {
        method: 'POST',
        body: { date: selectedDate, ...form },
      })
      setForm({ type: 'cf', durationMin: 45, intensity: 6, notes: '' })
      setShowForm(false)
      await loadSessions()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">This Week</h1>
      <p className="page-subtitle">Tap a day to see the full plan.</p>

      <div className="week-strip">
        {week.map(({ label, iso }) => {
          const count = sessions.filter((s) => s.date.slice(0, 10) === iso).length
          return (
            <button
              key={label}
              className={`day-pill${label === selectedDay ? ' day-pill-active' : ''}${label === todayLabel ? ' day-pill-today' : ''}`}
              onClick={() => setSelectedDay(label)}
            >
              <span className="day-pill-label">{label}</span>
              <span className="day-pill-count">{count || '–'}</span>
            </button>
          )
        })}
      </div>

      <section className="day-detail">
        <div className="day-detail-header">
          <h2 className="day-detail-heading">
            {selectedDay}
            {selectedDay === todayLabel ? ' · Today' : ''}
          </h2>
          <button className="day-add-btn" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cancel' : '+ Add'}
          </button>
        </div>

        {showForm && (
          <form className="session-form" onSubmit={handleAddSession}>
            <div className="session-form-row">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {SESSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={form.durationMin}
                onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })}
                placeholder="min"
              />
              <input
                type="number"
                min="1"
                max="10"
                value={form.intensity}
                onChange={(e) => setForm({ ...form, intensity: Number(e.target.value) })}
                placeholder="1-10"
              />
            </div>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes"
              rows={2}
            />
            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save session'}
            </button>
          </form>
        )}

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <div className="placeholder-card">Loading…</div>
        ) : daySessions.length === 0 ? (
          <div className="placeholder-card">Rest day. Nothing scheduled.</div>
        ) : (
          <div className="session-list">
            {daySessions.map((session) => (
              <SessionCard
                key={session.id}
                session={{
                  type: session.type,
                  durationMin: session.duration_min,
                  intensity: session.intensity,
                  notes: session.notes,
                }}
                detailed
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
