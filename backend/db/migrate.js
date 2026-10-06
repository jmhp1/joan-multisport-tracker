import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import 'dotenv/config'
import { pool } from '../config/db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function migrate() {
  const sql = readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(sql)
  console.log('Schema applied.')
  await pool.end()
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
