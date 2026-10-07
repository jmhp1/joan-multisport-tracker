import { useEffect, useState } from 'react'
import Chart from '../components/Chart.jsx'
import { useApi } from '../api/useApi.js'
import { toLocalISODate } from '../utils/date.js'
import '../styles/Evolution.css'

const METRIC_TABS = [
  { key: 'weight', label: 'Weight', color: 'var(--color-accent)', defaultUnit: 'kg' },
  { key: 'climbing_grade', label: 'Climbing', color: 'var(--color-climb)', defaultUnit: 'grade' },
  { key: 'run_time', label: 'Running', color: 'var(--color-run)', defaultUnit: 'min/10k' },
  { key: 'cf_lift', label: 'CF Lifts', color: 'var(--color-cf)', defaultUnit: 'kg' },
]

export default function Evolution() {
  const api = useApi()
  const [activeKey, setActiveKey] = useState(METRIC_TABS[0].key)
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadMetrics() {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/api/metrics')
      setMetrics(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const active = METRIC_TABS.find((m) => m.key === activeKey)

  async function handleAddMetric(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await api('/api/metrics', {
        method: 'POST',
        body: {
          date: toLocalISODate(new Date()),
          metricType: activeKey,
          value: Number(value),
          unit: metrics.find((m) => m.metric_type === activeKey)?.unit ?? active.defaultUnit,
        },
      })
      setValue('')
      setShowForm(false)
      await loadMetrics()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }
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
      <div className="meals-header">
        <div>
          <h1 className="page-title">Evolution</h1>
          <p className="page-subtitle">Weight, climbing grades, run times, and CF lifts over time.</p>
        </div>
        <button className="day-add-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

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

      {showForm && (
        <form className="metric-form" onSubmit={handleAddMetric}>
          <input
            type="number"
            step="any"
            placeholder={`New ${active.label.toLowerCase()} value (${active.defaultUnit})`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </form>
      )}

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
