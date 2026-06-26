import { Router } from 'express'
import { getLlmMetadata } from '../llm/client.js'

const router = Router()

router.get('/health', (req, res) => {
  const { model } = getLlmMetadata()
  res.json({ status: 'ok', model })
})

export default router
