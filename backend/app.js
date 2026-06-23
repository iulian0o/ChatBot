import express from 'express'
import cors from 'cors'
import corsOptions from './config/cors.js'

const app = express()

// Middleware: Jaimie update this

app.use(express.json())
app.use(cors(corsOptions))

// Routers: Khan update this

try {
  const {default: reviewRouter} = await import('./routes/review.js')
  const {default: healthRouter} = await import('./routes/health.js')
  const {default: historyRouter} = await import('./routes/history.js')

  app.use('/api', reviewRouter)
  app.use('/api', healthRouter)
  app.use('/api', historyRouter)
} catch {err} {
  console.warn('[app.js] Rputes not loaded yet: ', err.message)
}

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({error: 'Internal server error'})
})

export default app