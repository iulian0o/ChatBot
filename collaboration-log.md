# Collaboration Log

## Jaimie — Middleware (Student B)

**2026-06-24**
- Implemented validate.js, errors.js, rateLimit.js, logger.js
- Dead end: typo'd filename `erros.js` instead of `errors.js` — caused
  ERR_MODULE_NOT_FOUND on container start, looked like a docker cache
  issue at first, actually just a missing/misnamed file. Found via
  `docker-compose logs -f backend`.
- Tested manually with curl: empty code -> 400, 6 rapid requests -> 5
  pass + 1 429, logger prints method/path/status/duration/lang
- Wired into app.js (Costi's file) with his sign-off, committed separately