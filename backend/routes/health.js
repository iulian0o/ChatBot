import {Router} from 'express'

const router = Router()

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    model: process.env.LLM_MODEL || 'not set',
  })
})

export default router