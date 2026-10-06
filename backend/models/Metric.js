import { pool } from '../config/db.js'

export const Metric = {
  async listForUser(userId, metricType) {
    const { rows } = await pool.query(
      metricType
        ? 'SELECT * FROM metrics WHERE user_id = $1 AND metric_type = $2 ORDER BY date ASC'
        : 'SELECT * FROM metrics WHERE user_id = $1 ORDER BY date ASC',
      metricType ? [userId, metricType] : [userId],
    )
    return rows
  },

  async create({ userId, date, metricType, label, value, unit }) {
    const { rows } = await pool.query(
      `INSERT INTO metrics (user_id, date, metric_type, label, value, unit)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, date, metricType, label, value, unit],
    )
    return rows[0]
  },
}
