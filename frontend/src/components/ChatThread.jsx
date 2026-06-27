import { useEffect, useRef } from 'react'
import './ChatThread.css'

function renderMessage(text) {
  const segments = text.split(/(```[\s\S]*?```)/g)
  return segments.map((seg, i) => {
    if (seg.startsWith('```')) {
      const code = seg.replace(/^```\w*\n?/, '').replace(/```$/, '')
      return <pre key={i} className="chat-code"><code>{code}</code></pre>
    }
    return <span key={i} className="chat-text">{seg}</span>
  })
}

function ChatThread({ messages, loading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="chat-thread">
      {messages.length === 0 && !loading && (
        <p className="chat-empty">Paste your code below and send to start a review.</p>
      )}

      {messages.map((msg, i) => (
        <div key={i} className={`chat-bubble-wrap ${msg.role}`}>
          <div className={`chat-bubble ${msg.role}`}>
            {renderMessage(msg.content)}
          </div>
        </div>
      ))}

      {}
      {loading && (
        <div className="chat-bubble-wrap assistant">
          <div className="chat-bubble assistant chat-typing">
            <span /><span /><span />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

export default ChatThread