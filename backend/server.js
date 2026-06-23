import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`[server] Backend running on http://localhost:${PORT}`)
  console.log(`[server] LLM provider : ${process.env.LLM_PROVIDER || 'not set'}`)
  console.log(`[server] LLM model : ${process.env.LLM_MODEL || 'not set'}`)
})