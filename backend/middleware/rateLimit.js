import rateLimit from 'express-rate-limit'

const reviewLimiter = rateLimit({
  windowMs: 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down there partner.' },
})

export default reviewLimiter