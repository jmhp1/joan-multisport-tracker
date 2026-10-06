import 'dotenv/config'
import bcrypt from 'bcrypt'
import { pool } from '../config/db.js'
import { User } from '../models/User.js'
import { Session } from '../models/Session.js'
import { Meal } from '../models/Meal.js'
import { Metric } from '../models/Metric.js'
import { Trip } from '../models/Trip.js'

const DEMO_EMAIL = 'joan@example.com'
const DEMO_PASSWORD = 'training123'

function toLocalISODate(d) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function mostRecentMonday() {
  const now = new Date()
  const diff = (now.getDay() + 6) % 7 // days since Monday
  now.setDate(now.getDate() - diff)
  return now
}

function dateFor(offsetDays) {
  const d = mostRecentMonday()
  d.setDate(d.getDate() + offsetDays)
  return toLocalISODate(d)
}

async function seed() {
  let user = await User.findByEmail(DEMO_EMAIL)
  if (!user) {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)
    user = await User.create({ email: DEMO_EMAIL, passwordHash })
    console.log(`Created demo user ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
  } else {
    console.log(`Demo user ${DEMO_EMAIL} already exists`)
  }

  const sessions = [
    { offset: 0, type: 'cf', durationMin: 50, intensity: 7, notes: 'Strength: back squat 5x3 @80%, then EMOM 12 burpees/wall balls.' },
    { offset: 1, type: 'climbing', durationMin: 90, intensity: 6, notes: 'Bouldering session, projecting 6B/6C, worked crimpy overhangs.' },
    { offset: 2, type: 'running', durationMin: 70, intensity: 6, notes: 'Long steady run, 12km @ zone 2, rolling hills.' },
    { offset: 3, type: 'cf', durationMin: 45, intensity: 8, notes: 'Conditioning: 5 rounds for time — row 500m, 15 box jumps, 10 KB swings.' },
    { offset: 5, type: 'climbing', durationMin: 120, intensity: 7, notes: 'Outdoor sport climbing day, 5 routes up to 6a+.' },
    { offset: 5, type: 'running', durationMin: 40, intensity: 5, notes: 'Easy recovery jog, flat route.' },
    { offset: 6, type: 'running', durationMin: 85, intensity: 7, notes: 'Long run/row focus (Hyrox prep), 10km run straight through, no stations.' },
  ]
  for (const s of sessions) {
    await Session.create({ userId: user.id, date: dateFor(s.offset), type: s.type, durationMin: s.durationMin, intensity: s.intensity, notes: s.notes })
  }

  const meals = [
    { type: 'breakfast', food: 'Oats + whey', grams: 90, protein: 28, carbs: 55, fat: 8 },
    { type: 'breakfast', food: 'Banana', grams: 120, protein: 1, carbs: 27, fat: 0 },
    { type: 'lunch', food: 'Chicken breast', grams: 180, protein: 42, carbs: 0, fat: 4 },
    { type: 'lunch', food: 'Rice', grams: 150, protein: 4, carbs: 45, fat: 1 },
    { type: 'lunch', food: 'Mixed salad + olive oil', grams: 100, protein: 2, carbs: 5, fat: 10 },
    { type: 'snack', food: 'Greek yoghurt', grams: 170, protein: 17, carbs: 7, fat: 4 },
    { type: 'snack', food: 'Almonds', grams: 25, protein: 5, carbs: 5, fat: 13 },
    { type: 'dinner', food: 'Salmon', grams: 180, protein: 38, carbs: 0, fat: 20 },
    { type: 'dinner', food: 'Sweet potato', grams: 200, protein: 3, carbs: 40, fat: 0 },
    { type: 'dinner', food: 'Broccoli', grams: 150, protein: 4, carbs: 10, fat: 0 },
  ]
  const today = toLocalISODate(new Date())
  for (const m of meals) {
    const calories = m.protein * 4 + m.carbs * 4 + m.fat * 9
    await Meal.create({ userId: user.id, date: today, mealType: m.type, food: m.food, grams: m.grams, protein: m.protein, carbs: m.carbs, fat: m.fat, calories })
  }

  const metricSeries = {
    weight: { unit: 'kg', values: [76.2, 75.6, 75.1, 74.8, 74.5, 74.2] },
    climbing_grade: { unit: 'grade', values: [5, 5.2, 5.5, 5.5, 5.8, 6] },
    run_time: { unit: 'min/10k', values: [48.5, 47.8, 47.1, 46.4, 45.9, 45.3] },
    cf_lift: { unit: 'kg back squat 1RM', values: [100, 102.5, 105, 105, 110, 112.5] },
  }
  const metricDates = ['2026-06-01', '2026-06-15', '2026-07-01', '2026-07-15', '2026-08-01', '2026-08-15']
  for (const [metricType, { unit, values }] of Object.entries(metricSeries)) {
    for (let i = 0; i < values.length; i++) {
      await Metric.create({ userId: user.id, date: metricDates[i], metricType, label: null, value: values[i], unit })
    }
  }

  await Trip.create({
    userId: user.id,
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
  })
  await Trip.create({
    userId: user.id,
    name: 'Jotunheimen Haute Route',
    location: 'Jotunheimen, Norway',
    objective: 'Galdhøpiggen + Glittertind, 4-day hut-to-hut',
    targetDate: '2027-08-10',
    checklist: [
      { label: 'DNT hut reservations', done: false },
      { label: 'Route plan + bail-out points', done: false },
      { label: 'Gear shakedown weekend', done: false },
    ],
  })

  console.log('Seed complete.')
  await pool.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
