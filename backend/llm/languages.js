export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'c',
  'php',
  'ruby',
  'go',
  'rust',
]

export const LANGUAGE_HINTS = {
  javascript: 'Mention relevant ESLint, async/await, input validation, and browser or Node.js runtime concerns.',
  typescript: 'Mention type safety, strict null checks, unsafe any usage, and API contract clarity.',
  python: 'Mention PEP 8, exception handling, data validation, and common runtime edge cases.',
  java: 'Mention null safety, object design, exception handling, resource management, and concurrency concerns.',
  csharp: 'Mention nullability, LINQ readability, async usage, exception handling, and .NET conventions.',
  cpp: 'Mention memory ownership, undefined behavior, RAII, bounds safety, and performance tradeoffs.',
  c: 'Mention memory safety, pointer checks, buffer boundaries, allocation ownership, and undefined behavior.',
  php: 'Mention input sanitization, type juggling, framework conventions, and secure database access.',
  ruby: 'Mention idiomatic Ruby style, exception handling, data validation, and performance pitfalls.',
  go: 'Mention error handling, goroutine safety, context usage, and idiomatic simplicity.',
  rust: 'Mention ownership, borrowing, error handling, panic risks, and idiomatic Result usage.',
}

export function normalizeLanguage(language) {
  if (typeof language !== 'string') {
    return 'plaintext'
  }

  return language.trim().toLowerCase() || 'plaintext'
}

export function getLanguageHint(language) {
  return LANGUAGE_HINTS[normalizeLanguage(language)] || 'Apply general code review best practices for this language.'
}

