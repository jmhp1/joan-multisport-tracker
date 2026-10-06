import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import sessionRoutes from './routes/sessions.js'
import mealRoutes from './routes/meals.js'
import metricRoutes from './routes/metrics.js'
import tripRoutes from './routes/trips.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/meals', mealRoutes)
app.use('/api/metrics', metricRoutes)
app.use('/api/trips', tripRoutes)

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`API listening on port ${port}`))
