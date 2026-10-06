import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import MealLogger from './pages/MealLogger.jsx'
import Evolution from './pages/Evolution.jsx'
import TripPlanner from './pages/TripPlanner.jsx'
import Login from './pages/Login.jsx'
import { useAuth } from './context/AuthContext.jsx'
import './App.css'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/meals', label: 'Meals' },
  { to: '/evolution', label: 'Evolution' },
  { to: '/trips', label: 'Trips' },
]

export default function App() {
  const { token, user, logout } = useAuth()

  if (!token) {
    return <Login />
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-title">Multisport Tracker</span>
        <div className="app-header-right">
          <span className="app-user">{user?.email}</span>
          <button className="app-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <main className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/meals" element={<MealLogger />} />
          <Route path="/evolution" element={<Evolution />} />
          <Route path="/trips" element={<TripPlanner />} />
        </Routes>
      </main>

      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
