import pg from 'pg'

const { Pool } = pg

// By default pg parses DATE columns into JS Date objects at local midnight, which
// then shift to the previous day when serialized via JSON.stringify's toISOString()
// in any timezone ahead of UTC. Keep DATE as the raw 'YYYY-MM-DD' string instead.
pg.types.setTypeParser(1082, (val) => val)

// Railway injects DATABASE_URL automatically when a Postgres plugin is attached.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false,
})
