import { useState } from 'react'
import Chart from '../components/Chart.jsx'
import '../styles/Evolution.css'

// Hardcoded sample history — will come from GET /api/metrics once the backend is wired up.
const METRIC_TABS = [
  {
    key: 'weight',
    label: 'Weight',
    unit: 'kg',
    data: [
      { date: 'Jun 1', value: 76.2 },
      { date: 'Jun 15', value: 75.6 },
      { date: 'Jul 1', value: 75.1 },
      { date: 'Jul 15', value: 74.8 },
      { date: 'Aug 1', value: 74.5 },
      { date: 'Aug 15', value: 74.2 },
    ],
    color: 'var(--color-accent)',
  },
  {
    key: 'climbing_grade',
    label: 'Climbing',
    unit: 'max grade',
    data: [
      { date: 'Jun 1', value: 5 },
      { date: 'Jun 15', value: 5.2 },
      { date: 'Jul 1', value: 5.5 },
      { date: 'Jul 15', value: 5.5 },
      { date: 'Aug 1', value: 5.8 },
      { date: 'Aug 15', value: 6 },
    ],
    color: 'var(--color-climb)',
  },
  {
    key: 'run_time',
    label: 'Running',
    unit: 'min/10k',
    data: [
      { date: 'Jun 1', value: 48.5 },
      { date: 'Jun 15', value: 47.8 },
      { date: 'Jul 1', value: 47.1 },
      { date: 'Jul 15', value: 46.4 },
      { date: 'Aug 1', value: 45.9 },
      { date: 'Aug 15', value: 45.3 },
    ],
    color: 'var(--color-run)',
  },
  {
    key: 'cf_lift',
    label: 'CF Lifts',
    unit: 'kg back squat 1RM',
    data: [
      { date: 'Jun 1', value: 100 },
      { date: 'Jun 15', value: 102.5 },
      { date: 'Jul 1', value: 105 },
      { date: 'Jul 15', value: 105 },
      { date: 'Aug 1', value: 110 },
      { date: 'Aug 15', value: 112.5 },
    ],
    color: 'var(--color-cf)',
  },
]

export default function Evolution() {
  const [activeKey, setActiveKey] = useState(METRIC_TABS[0].key)
  const active = METRIC_TABS.find((m) => m.key === activeKey)
  const latest = active.data[active.data.length - 1]
  const first = active.data[0]
  const delta = (latest.value - first.value).toFixed(1)

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

      <div className="metric-summary">
        <div className="metric-latest">
          {latest.value} <span className="metric-unit">{active.unit}</span>
        </div>
        <div className="metric-delta">
          {delta > 0 ? '+' : ''}{delta} since {first.date}
        </div>
      </div>

      <div className="chart-card">
        <Chart data={active.data} color={active.color} />
      </div>
    </div>
  )
}
