import { Router } from 'express'

const router = Router()

// Demo code: Khan will replace this
router.get('/history', (req, res) => {
  res.json({ history: [] })
})

export default router