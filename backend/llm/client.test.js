import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import { reviewCode } from './client.js'

const ORIGINAL_ENV = {
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  LLM_MODEL: process.env.LLM_MODEL,
  LLM_PROVIDER: process.env.LLM_PROVIDER,
}

const originalFetch = globalThis.fetch

function restoreEnv() {
  for (const [key, value] of Object.entries(ORIGINAL_ENV)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
}

afterEach(() => {
  restoreEnv()
  globalThis.fetch = originalFetch
})

describe('reviewCode', () => {
  it('uses the stub provider by default', async () => {
    delete process.env.LLM_PROVIDER

    const reply = await reviewCode('console.log(1)', 'javascript', [])

    assert.equal(reply, 'Code review stub: looks good!')
  })

  it('fails clearly for unsupported providers', async () => {
    process.env.LLM_PROVIDER = 'unknown'

    await assert.rejects(
      reviewCode('console.log(1)', 'javascript', []),
      /Unsupported LLM provider: unknown/,
    )
  })

  it('requires an API key for the Groq provider', async () => {
    process.env.LLM_PROVIDER = 'groq'
    process.env.GROQ_API_KEY = ''

    await assert.rejects(
      reviewCode('console.log(1)', 'javascript', []),
      /GROQ_API_KEY is required when LLM_PROVIDER is groq/,
    )
  })

  it('returns the Groq reply and sends the expected chat completion body', async () => {
    process.env.LLM_PROVIDER = 'groq'
    process.env.LLM_MODEL = 'llama-test-model'
    process.env.GROQ_API_KEY = 'test-key'

    let request
    globalThis.fetch = async (url, options) => {
      request = { url, options }

      return {
        ok: true,
        async json() {
          return {
            choices: [
              {
                message: {
                  content: 'Use input validation and handle the null case.',
                },
              },
            ],
          }
        },
      }
    }

    const reply = await reviewCode('console.log(1)', 'javascript', [])

    assert.equal(reply, 'Use input validation and handle the null case.')
    assert.equal(request.url, 'https://api.groq.com/openai/v1/chat/completions')
    assert.equal(request.options.method, 'POST')
    assert.equal(request.options.headers.Authorization, 'Bearer test-key')

    const body = JSON.parse(request.options.body)
    assert.equal(body.model, 'llama-test-model')
    assert.equal(body.temperature, 0.2)
    assert.equal(body.max_completion_tokens, 900)
    assert.equal(body.messages.at(-1).role, 'user')
    assert.match(body.messages.at(-1).content, /```javascript\nconsole\.log\(1\)\n```/)
  })

  it('uses the current Groq fallback model when no model is configured', async () => {
    process.env.LLM_PROVIDER = 'groq'
    process.env.GROQ_API_KEY = 'test-key'
    delete process.env.LLM_MODEL

    let requestBody
    globalThis.fetch = async (url, options) => {
      requestBody = JSON.parse(options.body)

      return {
        ok: true,
        async json() {
          return {
            choices: [
              {
                message: {
                  content: 'Looks fine for this small snippet.',
                },
              },
            ],
          }
        },
      }
    }

    await reviewCode('console.log(1)', 'javascript', [])

    assert.equal(requestBody.model, 'openai/gpt-oss-20b')
  })
})
