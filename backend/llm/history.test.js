import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { buildMessages, buildReviewUserMessage } from './history.js'

describe('buildReviewUserMessage', () => {
  it('formats code as a fenced markdown block with the normalized language', () => {
    const message = buildReviewUserMessage('console.log(1)', ' JavaScript ')

    assert.equal(
      message,
      [
        'Please review this javascript code:',
        '',
        '```javascript',
        'console.log(1)',
        '```',
      ].join('\n'),
    )
  })

  it('uses language aliases in the fenced markdown block', () => {
    const message = buildReviewUserMessage('const value = 1', 'js')

    assert.match(message, /Please review this javascript code:/)
    assert.match(message, /```javascript\nconst value = 1\n```/)
  })
})

describe('buildMessages', () => {
  it('adds the system prompt, valid history, and the new review request', () => {
    const messages = buildMessages('print("hello")', 'python', [
      { role: 'user', content: 'Can you review this?' },
      { role: 'assistant', content: 'Yes.' },
      { role: 'system', content: 'This should be ignored.' },
      { role: 'user', content: 42 },
    ])

    assert.equal(messages.length, 4)
    assert.equal(messages[0].role, 'system')
    assert.match(messages[0].content, /PEP 8/)
    assert.match(messages[0].content, /untrusted content/)
    assert.match(messages[0].content, /Do not repeat secrets/)
    assert.deepEqual(messages[1], { role: 'user', content: 'Can you review this?' })
    assert.deepEqual(messages[2], { role: 'assistant', content: 'Yes.' })
    assert.equal(messages[3].role, 'user')
    assert.match(messages[3].content, /```python\nprint\("hello"\)\n```/)
  })

  it('keeps only the latest valid history messages', () => {
    const history = Array.from({ length: 10 }, (_, index) => ({
      role: index % 2 === 0 ? 'user' : 'assistant',
      content: `message ${index + 1}`,
    }))

    const messages = buildMessages('console.log(1)', 'javascript', history)
    const historyMessages = messages.slice(1, -1)

    assert.equal(historyMessages.length, 8)
    assert.equal(historyMessages[0].content, 'message 3')
    assert.equal(historyMessages.at(-1).content, 'message 10')
  })

  it('truncates very long history message content', () => {
    const longContent = 'a'.repeat(2100)

    const messages = buildMessages('console.log(1)', 'javascript', [
      { role: 'user', content: longContent },
    ])

    assert.ok(messages[1].content.length < longContent.length)
    assert.match(messages[1].content, /\[Message truncated for context length\]$/)
  })
})
