const TYPE_STYLES = {
  cf: { label: 'CrossFit', color: 'var(--color-cf)' },
  climbing: { label: 'Climbing', color: 'var(--color-climb)' },
  running: { label: 'Running', color: 'var(--color-run)' },
}

export default function SessionCard({ session, detailed = false }) {
  const style = TYPE_STYLES[session.type] ?? { label: session.type, color: 'var(--color-text-dim)' }

  return (
    <div className="session-card" style={{ borderLeftColor: style.color }}>
      <div className="session-card-top">
        <span className="session-type" style={{ color: style.color }}>
          {style.label}
        </span>
        <span className="session-duration">{session.durationMin} min</span>
      </div>
      <div className="session-card-meta">
        <span className="session-intensity">Intensity {session.intensity}/10</span>
      </div>
      {detailed && session.notes && <p className="session-notes">{session.notes}</p>}
    </div>
  )
}
