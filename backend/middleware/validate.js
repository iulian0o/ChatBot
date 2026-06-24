export function validateReviewBody(req, res, next) {
  const { code, language } = req.body

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ error: 'code is required and must be a non-empty string' })
  }

  if (!language || typeof language !== 'string') {
    return res.status(400).json({ error: 'language is required and must be a string' })
  }

  if (code.length > 10000) {
    return res.status(400).json({ error: 'code exceeds max length of 10000 characters' })
  }

  next()
}