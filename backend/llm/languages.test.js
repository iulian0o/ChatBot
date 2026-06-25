import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { getLanguageHint, normalizeLanguage } from './languages.js'

describe('normalizeLanguage', () => {
  it('normalizes common language aliases', () => {
    assert.equal(normalizeLanguage('JS'), 'javascript')
    assert.equal(normalizeLanguage(' py '), 'python')
    assert.equal(normalizeLanguage('c++'), 'cpp')
    assert.equal(normalizeLanguage('C#'), 'csharp')
    assert.equal(normalizeLanguage('golang'), 'go')
  })

  it('falls back to plaintext for missing or invalid language values', () => {
    assert.equal(normalizeLanguage(''), 'plaintext')
    assert.equal(normalizeLanguage(null), 'plaintext')
  })
})

describe('getLanguageHint', () => {
  it('uses normalized aliases when selecting language hints', () => {
    assert.match(getLanguageHint('js'), /ESLint/)
    assert.match(getLanguageHint('py'), /PEP 8/)
  })

  it('returns a generic hint for unknown languages', () => {
    assert.match(getLanguageHint('kotlin'), /general code review best practices/)
  })
})

