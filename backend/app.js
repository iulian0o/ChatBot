import express from 'express'
import cors from 'cors'
import corsOptions from './config/cors.js'
import reviewRouter  from './routes/review.js'
import healthRouter  from './routes/health.js'
import historyRouter from './routes/history.js'

import { requestLogger } from './middleware/logger.js'
import reviewLimiter from './middleware/rateLimit.js'
import { validateReviewBody } from './middleware/validate.js'
import { errorHandler } from './middleware/errors.js'

const app = express()

app.use(express.json())
app.use(cors(corsOptions))
app.use(requestLogger)

app.use('/api/review', reviewLimiter, validateReviewBody)

app.use('/api', reviewRouter)
app.use('/api', healthRouter)
app.use('/api', historyRouter)

app.use(errorHandler)

export default app