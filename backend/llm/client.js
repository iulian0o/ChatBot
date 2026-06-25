import { buildMessages } from './history.js'

export async function reviewCode(code, language, history = []) {
  buildMessages(code, language, history)

  return 'Code review stub: looks good!'
}

