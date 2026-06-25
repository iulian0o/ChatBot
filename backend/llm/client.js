import { buildMessages } from './history.js'

const DEFAULT_PROVIDER = 'stub'
const DEFAULT_MODEL = 'stub-code-reviewer'
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b'
const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions'

export function getLlmMetadata() {
  const provider = process.env.LLM_PROVIDER?.trim().toLowerCase() || DEFAULT_PROVIDER
  const fallbackModel = provider === 'groq' ? DEFAULT_GROQ_MODEL : DEFAULT_MODEL

  return {
    provider,
    model: process.env.LLM_MODEL?.trim() || fallbackModel,
  }
}

function reviewWithStub() {
  return 'Code review stub: looks good!'
}

async function reviewWithGroq(messages, model) {
  const apiKey = process.env.GROQ_API_KEY?.trim()

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is required when LLM_PROVIDER is groq')
  }

  const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_completion_tokens: 900,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = data?.error?.message || `Groq request failed with status ${response.status}`
    throw new Error(message)
  }

  const reply = data?.choices?.[0]?.message?.content

  if (typeof reply !== 'string' || reply.trim().length === 0) {
    throw new Error('Groq response did not include a review reply')
  }

  return reply
}

export async function reviewCode(code, language, history = []) {
  const messages = buildMessages(code, language, history)
  const { provider, model } = getLlmMetadata()

  if (provider === 'stub') {
    return reviewWithStub(messages)
  }

  if (provider === 'groq') {
    return reviewWithGroq(messages, model)
  }

  throw new Error(`Unsupported LLM provider: ${provider}`)
}
