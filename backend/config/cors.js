import cors from 'cors'

const allowedOrigins = [
  'http://localhost:3000',
  'http://frontend:3000'
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}

export default corsOptions