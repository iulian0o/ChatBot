import {Router} from 'express'

const router = Router()

// Demo code: Khan will replace this

router.post('/review', (req, res) => {
  res.json({reply: 'They say Satoru Gojo is the strongest, but your code might be stronger: good review'})
})

export default router