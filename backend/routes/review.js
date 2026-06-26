import { Router } from 'express'
import { reviewCode } from '../llm/client.js'

const router = Router()

router.post('/review', async (req, res, next) => {
  const { code, language, history = [] } = req.body

  try {
    const reply = await reviewCode(code, language, history)
    res.json({ reply })
  } catch (err) {
    next(err)
  }
})

export default router
