import { useEffect, useState } from 'react'
import Chart from '../components/Chart.jsx'
import { useApi } from '../api/useApi.js'
import '../styles/Evolution.css'

const METRIC_TABS = [
  { key: 'weight', label: 'Weight', color: 'var(--color-accent)' },
  { key: 'climbing_grade', label: 'Climbing', color: 'var(--color-climb)' },
  { key: 'run_time', label: 'Running', color: 'var(--color-run)' },
  { key: 'cf_lift', label: 'CF Lifts', color: 'var(--color-cf)' },
]

export default function Evolution() {
  const api = useApi()
  const [activeKey, setActiveKey] = useState(METRIC_TABS[0].key)
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    api('/api/metrics')
      .then((data) => {
        if (!cancelled) setMetrics(data)
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

  const active = METRIC_TABS.find((m) => m.key === activeKey)
  const series = metrics
    .filter((m) => m.metric_type === activeKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((m) => ({ date: m.date.slice(0, 10), value: Number(m.value) }))
  const unit = metrics.find((m) => m.metric_type === activeKey)?.unit ?? ''

  const latest = series[series.length - 1]
  const first = series[0]
  const delta = latest && first ? (latest.value - first.value).toFixed(1) : null

  return (
    <div>
      <h1 className="page-title">Evolution</h1>
      <p className="page-subtitle">Weight, climbing grades, run times, and CF lifts over time.</p>

      <div className="metric-tabs">
        {METRIC_TABS.map((m) => (
          <button
            key={m.key}
            className={`metric-tab${m.key === activeKey ? ' metric-tab-active' : ''}`}
            onClick={() => setActiveKey(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="placeholder-card">Loading…</div>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : series.length === 0 ? (
        <div className="placeholder-card">No {active.label.toLowerCase()} data logged yet.</div>
      ) : (
        <>
          <div className="metric-summary">
            <div className="metric-latest">
              {latest.value} <span className="metric-unit">{unit}</span>
            </div>
            {delta !== null && (
              <div className="metric-delta">
                {delta > 0 ? '+' : ''}
                {delta} since {first.date}
              </div>
            )}
          </div>

          <div className="chart-card">
            <Chart data={series} color={active.color} />
          </div>
        </>
      )}
    </div>
  )
}
