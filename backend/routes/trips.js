import { Router } from 'express'
import { Trip } from '../models/Trip.js'
import { requireAuth } from './middleware.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  const trips = await Trip.listForUser(req.userId)
  res.json(trips)
})

router.post('/', async (req, res) => {
  const { name, location, objective, targetDate, checklist } = req.body
  const trip = await Trip.create({ userId: req.userId, name, location, objective, targetDate, checklist })
  res.status(201).json(trip)
})

export default router
