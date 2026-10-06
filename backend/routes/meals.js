import { Router } from 'express'
import { Meal } from '../models/Meal.js'
import { requireAuth } from './middleware.js'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  const meals = await Meal.listForUser(req.userId)
  res.json(meals)
})

router.post('/', async (req, res) => {
  const { date, mealType, food, grams, protein, carbs, fat, calories } = req.body
  const meal = await Meal.create({ userId: req.userId, date, mealType, food, grams, protein, carbs, fat, calories })
  res.status(201).json(meal)
})

export default router
