import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import bcrypt from 'bcrypt'
import db from '../db/index.js'

const router = Router()
const TOKEN_DAYS = 7

function createExpiryDate() {
  const date = new Date()
  date.setDate(date.getDate() + TOKEN_DAYS)
  return date
}

function setAuthCookie(res, token, expiresAt) {
  res.cookie('auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    expires: expiresAt,
  })
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.auth_token

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const row = db.prepare(`
    SELECT t.user_id, u.username, t.expires_at
    FROM tokens t
    JOIN users u ON u.id = t.user_id
    WHERE t.token = ?
  `).get(token)

  if (!row) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  if (new Date(row.expires_at) < new Date()) {
    db.prepare('DELETE FROM tokens WHERE token = ?').run(token)
    return res.status(401).json({ error: 'Session expired' })
  }

  req.user = { id: row.user_id, username: row.username }
  next()
}

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body
  const trimmedUsername = typeof username === 'string' ? username.trim() : ''

  if (!trimmedUsername || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Username and password of at least 6 characters are required' })
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(trimmedUsername, passwordHash)

    res.status(201).json({ ok: true })
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Username is already taken' })
    }

    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  const trimmedUsername = typeof username === 'string' ? username.trim() : ''

  if (!trimmedUsername || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username and password are required' })
  }

  try {
    const user = db.prepare('SELECT id, username, password FROM users WHERE username = ?').get(trimmedUsername)

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    const token = randomUUID()
    const expiresAt = createExpiryDate()

    db.prepare('INSERT INTO tokens (user_id, token, expires_at) VALUES (?, ?, ?)').run(
      user.id,
      token,
      expiresAt.toISOString(),
    )

    setAuthCookie(res, token, expiresAt)
    res.json({ user: { id: user.id, username: user.username } })
  } catch (error) {
    next(error)
  }
})

router.post('/logout', (req, res) => {
  const token = req.cookies?.auth_token

  if (token) {
    db.prepare('DELETE FROM tokens WHERE token = ?').run(token)
  }

  res.clearCookie('auth_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  })
  res.json({ ok: true })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user })
})

export default router
