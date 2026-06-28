import express    from 'express'
import cors       from 'cors'
import cookieParser from 'cookie-parser'
import corsOptions  from './config/cors.js'
import authRouter    from './routes/auth.js'
import sessionsRouter from './routes/sessions.js'
import reviewRouter  from './routes/review.js'
import healthRouter  from './routes/health.js'
import historyRouter from './routes/history.js'

const app = express()

app.use(express.json())
app.use(cors({ ...corsOptions, credentials: true }))
app.use(cookieParser())

app.use('/api', authRouter)
app.use('/api', sessionsRouter)
app.use('/api', reviewRouter)
app.use('/api', healthRouter)
app.use('/api', historyRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

export default app