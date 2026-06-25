import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { reviewCode } from './client.js'

export const DEFAULT_BENCHMARK_MODELS = [
  'openai/gpt-oss-20b',
  'openai/gpt-oss-120b',
  'llama-3.1-8b-instant',
]

export const DEFAULT_BENCHMARK_CODE = `def calculate_discount(price, discount):
    final_price = price - discount
    if final_price < 0:
        return 0
    return final_price

print(calculate_discount("100", 20))`

export function parseBenchmarkModels(input) {
  if (!input) {
    return DEFAULT_BENCHMARK_MODELS
  }

  const models = input
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean)

  return [...new Set(models)]
}

function restoreEnv(previousEnv) {
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
}

export async function benchmarkModels({
  code = DEFAULT_BENCHMARK_CODE,
  language = 'python',
  models = DEFAULT_BENCHMARK_MODELS,
  review = reviewCode,
} = {}) {
  const previousEnv = {
    LLM_MODEL: process.env.LLM_MODEL,
    LLM_PROVIDER: process.env.LLM_PROVIDER,
  }

  const results = []

  for (const model of models) {
    process.env.LLM_PROVIDER = 'groq'
    process.env.LLM_MODEL = model

    const startedAt = performance.now()

    try {
      const reply = await review(code, language, [])
      const durationMs = Math.round(performance.now() - startedAt)

      results.push({
        model,
        status: 'ok',
        durationMs,
        reply,
        replyExcerpt: reply.slice(0, 500),
      })
    } catch (error) {
      const durationMs = Math.round(performance.now() - startedAt)

      results.push({
        model,
        status: 'error',
        durationMs,
        error: error.message,
      })
    }
  }

  restoreEnv(previousEnv)

  return results
}

export function formatBenchmarkResults(results) {
  const lines = [
    '| Model | Status | Duration | Notes |',
    '| --- | --- | ---: | --- |',
  ]

  for (const result of results) {
    const notes = result.status === 'ok'
      ? result.replyExcerpt.replaceAll('\n', ' ').replaceAll('|', '\\|')
      : result.error.replaceAll('|', '\\|')

    lines.push(`| ${result.model} | ${result.status} | ${result.durationMs}ms | ${notes} |`)
  }

  return lines.join('\n')
}

async function main() {
  const models = parseBenchmarkModels(process.argv[2] || process.env.BENCHMARK_MODELS)
  const results = await benchmarkModels({ models })

  console.log(formatBenchmarkResults(results))
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}

