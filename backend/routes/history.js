import { Router } from 'express'

const router = Router()

const conversationHistory = []

router.get('/history', (req, res) => {
  res.json({ history: conversationHistory })
})

router.post('/review', (req, res, next) => {
  const { code, language } = req.body

  conversationHistory.push(
    { role: 'user', content: `Please review this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`` }
  )

  next()
})

export default router
