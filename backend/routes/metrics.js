import { Router } from 'express'
import { Metric } from '../models/Metric.js'
import { requireAuth } from './middleware.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  const metrics = await Metric.listForUser(req.userId, req.query.type)
  res.json(metrics)
})

router.post('/', async (req, res) => {
  const { date, metricType, label, value, unit } = req.body
  const metric = await Metric.create({ userId: req.userId, date, metricType, label, value, unit })
  res.status(201).json(metric)
})

export default router
