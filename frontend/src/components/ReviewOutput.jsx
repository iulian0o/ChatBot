import './styles/ReviewOutput.css'

function ReviewOutput({ reply, loading }) {
  if (loading) {
    return (
      <div className="output-box output-loading">
        <span className="spinner" aria-label="Loading" />
        <p>Reviewing your code…</p>
      </div>
    )
  }

  if (!reply) {
    return (
      <div className="output-box output-empty">
        <p>The review will appear here.</p>
      </div>
    )
  }

  const segments = reply.split(/(```[\s\S]*?```)/g)

  return (
    <div className="output-box output-content">
      {segments.map((seg, i) => {
        if (seg.startsWith('```')) {
          const code = seg.replace(/^```\w*\n?/, '').replace(/```$/, '')
          return (
            <pre key={i} className="output-code"><code>{code}</code></pre>
          )
        }
        return <p key={i} className="output-text">{seg}</p>
      })}
    </div>
  )
}

export default ReviewOutput