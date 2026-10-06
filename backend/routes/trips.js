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

router.patch('/:id/checklist', async (req, res) => {
  const { checklist } = req.body
  const trip = await Trip.updateChecklist({ id: req.params.id, userId: req.userId, checklist })
  if (!trip) return res.status(404).json({ error: 'trip not found' })
  res.json(trip)
})

export default router
