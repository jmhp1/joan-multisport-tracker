import pg from 'pg'

const { Pool } = pg

// Railway injects DATABASE_URL automatically when a Postgres plugin is attached.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false,
})
