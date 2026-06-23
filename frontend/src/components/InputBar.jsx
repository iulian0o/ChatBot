import { useState } from 'react'
import './styles/InputBar.css'

function InputBar({ onSend, disabled }) {
  const [value, setValue] = useState('')

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)   
    setValue('')      
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="inputbar">
      <textarea
        className="inputbar-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a follow-up question… (Enter to send)"
        disabled={disabled}
        rows={2}
        aria-label="Follow-up question"
      />
      <button
        className="inputbar-btn"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        aria-label="Send"
      >
        Send
      </button>
    </div>
  )
}

export default InputBar