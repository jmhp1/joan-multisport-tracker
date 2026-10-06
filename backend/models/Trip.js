import { pool } from '../config/db.js'

export const Trip = {
  async listForUser(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM trips WHERE user_id = $1 ORDER BY target_date ASC',
      [userId],
    )
    return rows
  },

  async create({ userId, name, location, objective, targetDate, checklist = [] }) {
    const { rows } = await pool.query(
      `INSERT INTO trips (user_id, name, location, objective, target_date, checklist)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, name, location, objective, targetDate, JSON.stringify(checklist)],
    )
    return rows[0]
  },
}
