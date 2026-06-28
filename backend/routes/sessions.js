import { Router } from 'express'
import db from '../db/index.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.use(requireAuth)

router.get('/sessions', (req, res) => {
  const sessions = db.prepare(`
    SELECT id, title, language, created_at
    FROM sessions
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(req.user.id)

  res.json({ sessions })
})

router.post('/sessions', (req, res) => {
  const { id, title, language } = req.body

  if (!id) return res.status(400).json({ error: 'id is required' })

  db.prepare(`
    INSERT INTO sessions (id, user_id, title, language)
    VALUES (?, ?, ?, ?)
  `).run(id, req.user.id, title || 'New chat', language || 'javascript')

  res.status(201).json({ ok: true })
})

router.patch('/sessions/:id', (req, res) => {
  const { title, language } = req.body

  const session = db.prepare(
    'SELECT id FROM sessions WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id)

  if (!session) return res.status(404).json({ error: 'Session not found' })

  if (title) {
    db.prepare('UPDATE sessions SET title = ? WHERE id = ?').run(title, req.params.id)
  }
  if (language) {
    db.prepare('UPDATE sessions SET language = ? WHERE id = ?').run(language, req.params.id)
  }

  res.json({ ok: true })
})

router.delete('/sessions/:id', (req, res) => {
  db.prepare(
    'DELETE FROM sessions WHERE id = ? AND user_id = ?'
  ).run(req.params.id, req.user.id)

  res.json({ ok: true })
})

router.get('/sessions/:id/messages', (req, res) => {
  const session = db.prepare(
    'SELECT id FROM sessions WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id)

  if (!session) return res.status(404).json({ error: 'Session not found' })

  const messages = db.prepare(`
    SELECT role, content FROM messages
    WHERE session_id = ?
    ORDER BY created_at ASC
  `).all(req.params.id)

  res.json({ messages })
})

router.post('/sessions/:id/messages', (req, res) => {
  const { role, content } = req.body

  if (!role || !content) {
    return res.status(400).json({ error: 'role and content are required' })
  }

  const session = db.prepare(
    'SELECT id FROM sessions WHERE id = ? AND user_id = ?'
  ).get(req.params.id, req.user.id)

  if (!session) return res.status(404).json({ error: 'Session not found' })

  db.prepare(
    'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)'
  ).run(req.params.id, role, content)

  res.status(201).json({ ok: true })
})

export default router