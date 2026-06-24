export function requestLogger(req, res, next) {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const language = req.body?.language || '-'
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms lang=${language}`)
  })

  next()
}