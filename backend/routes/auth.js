import db from '../db/index.js'

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