import { buildMessages } from './history.js'

const DEFAULT_PROVIDER = 'stub'
const DEFAULT_MODEL = 'stub-code-reviewer'
const DEFAULT_GROQ_MODEL = 'openai/gpt-oss-20b'
const DEFAULT_TIMEOUT_MS = 30000
const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions'

function getTimeoutMs() {
  const timeoutMs = Number.parseInt(process.env.LLM_TIMEOUT_MS, 10)

  if (Number.isNaN(timeoutMs) || timeoutMs <= 0) {
    return DEFAULT_TIMEOUT_MS
  }

  return timeoutMs
}

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
  const timeoutMs = getTimeoutMs()

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is required when LLM_PROVIDER is groq')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
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
      throw new Error(`LLM request failed: ${message}`)
    }

    const reply = data?.choices?.[0]?.message?.content

    if (typeof reply !== 'string' || reply.trim().length === 0) {
      throw new Error('LLM request failed: Groq response did not include a review reply')
    }

    return reply
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`LLM request timed out after ${timeoutMs}ms`)
    }

    if (error.message?.startsWith('LLM request failed:')) {
      throw error
    }

    throw new Error(`LLM request failed: ${error.message}`)
  } finally {
    clearTimeout(timeout)
  }
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
