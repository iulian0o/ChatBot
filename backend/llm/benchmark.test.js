import assert from 'node:assert/strict'
import { afterEach, describe, it } from 'node:test'

import {
  DEFAULT_BENCHMARK_MODELS,
  benchmarkModels,
  formatBenchmarkResults,
  parseBenchmarkModels,
} from './benchmark.js'

const ORIGINAL_ENV = {
  LLM_MODEL: process.env.LLM_MODEL,
  LLM_PROVIDER: process.env.LLM_PROVIDER,
}

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
})

describe('parseBenchmarkModels', () => {
  it('returns default models when no input is provided', () => {
    assert.deepEqual(parseBenchmarkModels(), DEFAULT_BENCHMARK_MODELS)
  })

  it('trims, filters, and deduplicates model input', () => {
    assert.deepEqual(parseBenchmarkModels(' model-a, model-b ,, model-a '), ['model-a', 'model-b'])
  })
})

describe('benchmarkModels', () => {
  it('runs each model with the Groq provider and restores env afterwards', async () => {
    process.env.LLM_PROVIDER = 'stub'
    process.env.LLM_MODEL = 'stub-code-reviewer'

    const seenModels = []
    const results = await benchmarkModels({
      models: ['model-a', 'model-b'],
      review: async () => {
        seenModels.push(process.env.LLM_MODEL)
        assert.equal(process.env.LLM_PROVIDER, 'groq')
        return `Review from ${process.env.LLM_MODEL}`
      },
    })

    assert.deepEqual(seenModels, ['model-a', 'model-b'])
    assert.equal(process.env.LLM_PROVIDER, 'stub')
    assert.equal(process.env.LLM_MODEL, 'stub-code-reviewer')
    assert.equal(results.length, 2)
    assert.equal(results[0].status, 'ok')
    assert.match(results[0].reply, /model-a/)
  })

  it('captures model errors without stopping the full benchmark', async () => {
    const results = await benchmarkModels({
      models: ['model-a', 'model-b'],
      review: async () => {
        if (process.env.LLM_MODEL === 'model-a') {
          throw new Error('temporary failure')
        }

        return 'Review completed'
      },
    })

    assert.equal(results[0].status, 'error')
    assert.equal(results[0].error, 'temporary failure')
    assert.equal(results[1].status, 'ok')
  })
})

describe('formatBenchmarkResults', () => {
  it('formats benchmark output as a markdown table', () => {
    const markdown = formatBenchmarkResults([
      {
        model: 'model-a',
        status: 'ok',
        durationMs: 25,
        replyExcerpt: 'Good review\nwith newline',
      },
    ])

    assert.match(markdown, /\| Model \| Status \| Duration \| Notes \|/)
    assert.match(markdown, /\| model-a \| ok \| 25ms \| Good review with newline \|/)
  })
})

