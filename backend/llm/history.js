import { SYSTEM_PROMPT } from './prompts.js'
import { getLanguageHint, normalizeLanguage } from './languages.js'

const VALID_HISTORY_ROLES = new Set(['user', 'assistant'])

function sanitizeHistory(history) {
  if (!Array.isArray(history)) {
    return []
  }

  return history
    .filter((message) => VALID_HISTORY_ROLES.has(message?.role) && typeof message.content === 'string')
    .map((message) => ({
      role: message.role,
      content: message.content,
    }))
}

export function buildReviewUserMessage(code, language) {
  const normalizedLanguage = normalizeLanguage(language)

  return [
    `Please review this ${normalizedLanguage} code:`,
    '',
    `\`\`\`${normalizedLanguage}`,
    code,
    '```',
  ].join('\n')
}

export function buildMessages(code, language, history = []) {
  const languageHint = getLanguageHint(language)

  return [
    {
      role: 'system',
      content: `${SYSTEM_PROMPT}\n\nLanguage-specific guidance: ${languageHint}`,
    },
    ...sanitizeHistory(history),
    {
      role: 'user',
      content: buildReviewUserMessage(code, language),
    },
  ]
}

