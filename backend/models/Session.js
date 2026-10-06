import { pool } from '../config/db.js'

export const Session = {
  async listForUser(userId) {
    const { rows } = await pool.query(
      'SELECT * FROM training_sessions WHERE user_id = $1 ORDER BY date DESC',
      [userId],
    )
    return rows
  },

  async create({ userId, date, type, durationMin, intensity, notes }) {
    const { rows } = await pool.query(
      `INSERT INTO training_sessions (user_id, date, type, duration_min, intensity, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, date, type, durationMin, intensity, notes],
    )
    return rows[0]
  },
}
