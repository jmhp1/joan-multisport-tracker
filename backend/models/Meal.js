import { pool } from '../config/db.js'

export const Meal = {
  async listForUser(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM meals WHERE user_id = $1 ORDER BY date DESC',
      [userId],
    )
    return rows
  },

  async create({ userId, date, mealType, food, grams, protein, carbs, fat, calories }) {
    const { rows } = await pool.query(
      `INSERT INTO meals (user_id, date, meal_type, food, grams, protein, carbs, fat, calories)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [userId, date, mealType, food, grams, protein, carbs, fat, calories],
    )
    return rows[0]
  },
}
