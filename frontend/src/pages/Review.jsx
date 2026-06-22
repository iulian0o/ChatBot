import { useState, useRef } from 'react'

import CodeEditor   from '../components/CodeEditor'
import ReviewOutput from '../components/ReviewOutput'
import InputBar     from '../components/InputBar'
import './styles/Review.css'

function Review() {
  const [code, setCode]         = useState('')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [reply, setReply]       = useState(null)
  const [history, setHistory]   = useState([])

  const outputRef = useRef(null)

  async function sendMessage(userMessage) {
    setLoading(true)
    setError(null)

    const updatedHistory = [...history, { role: 'user', content: userMessage }]

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, history: updatedHistory }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        return
      }

      setReply(data.reply)
      setHistory([...updatedHistory, { role: 'assistant', content: data.reply }])
      outputRef.current?.scrollIntoView({ behavior: 'smooth' })

    } catch {
      setError('Could not reach the server. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  function handleReview() {
    if (!code.trim()) return
    setHistory([])   
    setReply(null)
    sendMessage(`Please review this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``)
  }

  function handleFollowUp(message) {
    sendMessage(message)
  }

  return (
    <main className="review-page">
      {}
      <section className="review-left">
        <div className="panel-card editor-panel">
          <CodeEditor
            code={code}
            language={language}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
          />
        </div>
        <button
          className="review-btn"
          onClick={handleReview}
          disabled={loading || !code.trim()}
        >
          {loading ? 'Reviewing…' : 'Review code →'}
        </button>
      </section>

      {}
      <section className="review-right" ref={outputRef}>
        <div className="panel-card output-panel">
          {error && <p className="review-error">{error}</p>}
          <ReviewOutput reply={reply} loading={loading} />
        </div>
        <InputBar onSend={handleFollowUp} disabled={loading} />
      </section>
    </main>
  )
}

export default Review