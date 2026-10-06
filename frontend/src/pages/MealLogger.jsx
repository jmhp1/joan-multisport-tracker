import { useEffect, useState } from 'react'
import MealCard from '../components/MealCard.jsx'
import { useApi } from '../api/useApi.js'
import { toLocalISODate } from '../utils/date.js'
import '../styles/MealLogger.css'

const MEAL_TYPES = ['breakfast', 'lunch', 'snack', 'dinner']
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner' }
const EMPTY_FORM = { mealType: 'breakfast', food: '', grams: '', protein: '', carbs: '', fat: '' }

function sumMacros(meals) {
  return meals.reduce(
    (totals, meal) => ({
      protein: totals.protein + Number(meal.protein || 0),
      carbs: totals.carbs + Number(meal.carbs || 0),
      fat: totals.fat + Number(meal.fat || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 },
  )
}

export default function MealLogger() {
  const api = useApi()
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const today = toLocalISODate(new Date())

  async function loadMeals() {
    setLoading(true)
    setError(null)
    try {
      const data = await api('/api/meals')
      setMeals(data.filter((m) => m.date.slice(0, 10) === today))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMeals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totals = sumMacros(meals)
  const calories = Math.round(totals.protein * 4 + totals.carbs * 4 + totals.fat * 9)

  async function handleAddMeal(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const protein = Number(form.protein || 0)
      const carbs = Number(form.carbs || 0)
      const fat = Number(form.fat || 0)
      await api('/api/meals', {
        method: 'POST',
        body: {
          date: today,
          mealType: form.mealType,
          food: form.food,
          grams: Number(form.grams || 0),
          protein,
          carbs,
          fat,
          calories: protein * 4 + carbs * 4 + fat * 9,
        },
      })
      setForm(EMPTY_FORM)
      setShowForm(false)
      await loadMeals()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="meals-header">
        <div>
          <h1 className="page-title">Meals</h1>
          <p className="page-subtitle">Today's food, grams, and macros.</p>
        </div>
        <button className="day-add-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <form className="meal-form" onSubmit={handleAddMeal}>
          <div className="meal-form-row">
            <select value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}>
              {MEAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {MEAL_LABELS[t]}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Food"
              value={form.food}
              onChange={(e) => setForm({ ...form, food: e.target.value })}
              required
            />
          </div>
          <div className="meal-form-row">
            <input
              type="number"
              min="0"
              placeholder="grams"
              value={form.grams}
              onChange={(e) => setForm({ ...form, grams: e.target.value })}
            />
            <input
              type="number"
              min="0"
              placeholder="protein g"
              value={form.protein}
              onChange={(e) => setForm({ ...form, protein: e.target.value })}
            />
            <input
              type="number"
              min="0"
              placeholder="carbs g"
              value={form.carbs}
              onChange={(e) => setForm({ ...form, carbs: e.target.value })}
            />
            <input
              type="number"
              min="0"
              placeholder="fat g"
              value={form.fat}
              onChange={(e) => setForm({ ...form, fat: e.target.value })}
            />
          </div>
          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save meal'}
          </button>
        </form>
      )}

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <div className="placeholder-card">Loading…</div>
      ) : meals.length === 0 ? (
        <div className="placeholder-card">No meals logged today.</div>
      ) : (
        <>
          <div className="totals-card">
            <div className="totals-calories">{calories} kcal</div>
            <div className="totals-row">
              <span>P {Math.round(totals.protein)}g</span>
              <span>C {Math.round(totals.carbs)}g</span>
              <span>F {Math.round(totals.fat)}g</span>
            </div>
          </div>

          {MEAL_TYPES.map((type) => {
            const items = meals.filter((m) => m.meal_type === type)
            if (items.length === 0) return null
            return (
              <section key={type} className="meal-section">
                <h2 className="meal-section-heading">{MEAL_LABELS[type]}</h2>
                <div className="meal-list">
                  {items.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
                </div>
              </section>
            )
          })}
        </>
      )}
    </div>
  )
}
