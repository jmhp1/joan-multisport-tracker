import { useState } from 'react'
import SessionCard from '../components/SessionCard.jsx'
import '../styles/Dashboard.css'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Hardcoded sample week — will come from GET /api/sessions once the backend is wired up.
const WEEK_SESSIONS = [
  {
    day: 'Mon',
    sessions: [
      { type: 'cf', durationMin: 50, intensity: 7, notes: 'Strength: back squat 5x3 @80%, then EMOM 12 burpees/wall balls.' },
    ],
  },
  {
    day: 'Tue',
    sessions: [
      { type: 'climbing', durationMin: 90, intensity: 6, notes: 'Bouldering session, projecting 6B/6C, worked crimpy overhangs.' },
    ],
  },
  {
    day: 'Wed',
    sessions: [
      { type: 'running', durationMin: 70, intensity: 6, notes: 'Long steady run, 12km @ zone 2, rolling hills.' },
    ],
  },
  {
    day: 'Thu',
    sessions: [
      { type: 'cf', durationMin: 45, intensity: 8, notes: 'Conditioning: 5 rounds for time — row 500m, 15 box jumps, 10 KB swings.' },
    ],
  },
  {
    day: 'Fri',
    sessions: [],
  },
  {
    day: 'Sat',
    sessions: [
      { type: 'climbing', durationMin: 120, intensity: 7, notes: 'Outdoor sport climbing day, 5 routes up to 6a+.' },
      { type: 'running', durationMin: 40, intensity: 5, notes: 'Easy recovery jog, flat route.' },
    ],
  },
  {
    day: 'Sun',
    sessions: [
      { type: 'running', durationMin: 85, intensity: 7, notes: 'Long run/row focus (Hyrox prep), 10km run straight through, no stations.' },
    ],
  },
]

function getTodayLabel() {
  const jsDay = new Date().getDay() // 0 = Sunday
  return DAY_LABELS[(jsDay + 6) % 7]
}

export default function Dashboard() {
  const todayLabel = getTodayLabel()
  const [selectedDay, setSelectedDay] = useState(todayLabel)

  const selected = WEEK_SESSIONS.find((d) => d.day === selectedDay)

  return (
    <div>
      <h1 className="page-title">This Week</h1>
      <p className="page-subtitle">Tap a day to see the full plan.</p>

      <div className="week-strip">
        {WEEK_SESSIONS.map(({ day, sessions }) => (
          <button
            key={day}
            className={`day-pill${day === selectedDay ? ' day-pill-active' : ''}${day === todayLabel ? ' day-pill-today' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            <span className="day-pill-label">{day}</span>
            <span className="day-pill-count">{sessions.length || '–'}</span>
          </button>
        ))}
      </div>

      <section className="day-detail">
        <h2 className="day-detail-heading">
          {selectedDay}
          {selectedDay === todayLabel ? ' · Today' : ''}
        </h2>

        {selected.sessions.length === 0 ? (
          <div className="placeholder-card">Rest day. Nothing scheduled.</div>
        ) : (
          <div className="session-list">
            {selected.sessions.map((session, i) => (
              <SessionCard key={i} session={session} detailed />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
