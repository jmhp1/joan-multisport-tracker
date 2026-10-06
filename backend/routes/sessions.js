import { Router } from 'express'
import { Session } from '../models/Session.js'
import { requireAuth } from './middleware.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  const sessions = await Session.listForUser(req.userId)
  res.json(sessions)
})

router.post('/', async (req, res) => {
  const { date, type, durationMin, intensity, notes } = req.body
  const session = await Session.create({ userId: req.userId, date, type, durationMin, intensity, notes })
  res.status(201).json(session)
})

export default router
