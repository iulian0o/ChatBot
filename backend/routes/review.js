import {Router} from 'express'

const router = Router()

// Demo code: Khan will replace this

router.post('/review', (req, res) => {
  res.json({reply: 'The code review is hard: looks good'})
})

export default router