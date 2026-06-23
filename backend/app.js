import express from 'express'
import cors from 'cors'
import corsOptions from './config/cors.js'
import reviewRouter  from './routes/review.js'
import healthRouter  from './routes/health.js'
import historyRouter from './routes/history.js'

const app = express()

app.use(express.json())
app.use(cors(corsOptions))

app.use('/api', reviewRouter)
app.use('/api', healthRouter)
app.use('/api', historyRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

export default app