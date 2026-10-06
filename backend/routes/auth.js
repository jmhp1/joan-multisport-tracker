import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const existing = await User.findByEmail(email)
  if (existing) {
    return res.status(409).json({ error: 'email already registered' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ email, passwordHash })
  res.status(201).json({ user })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findByEmail(email)
  if (!user) {
    return res.status(401).json({ error: 'invalid credentials' })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return res.status(401).json({ error: 'invalid credentials' })
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email } })
})

export default router
