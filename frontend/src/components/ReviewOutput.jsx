import './styles/ReviewOutput.css'

function renderInline(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean)

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className="inline-code">{part.slice(1, -1)}</code>
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }

    return <span key={index}>{part}</span>
  })
}

function isTableDivider(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)
}

function isTableRow(line) {
  return line.includes('|') && !isTableDivider(line)
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

function parseBlocks(markdown) {
  const lines = markdown.split(/\r?\n/)
  const blocks = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.replace(/^```/, '').trim()
      const codeLines = []
      index += 1

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index])
        index += 1
      }

      if (index < lines.length) {
        index += 1
      }

      blocks.push({ type: 'code', language, content: codeLines.join('\n') })
      continue
    }

    if (isTableRow(trimmed) && isTableDivider(lines[index + 1] || '')) {
      const headers = parseTableRow(trimmed)
      const rows = []
      index += 2

      while (index < lines.length && isTableRow(lines[index].trim())) {
        rows.push(parseTableRow(lines[index]))
        index += 1
      }

      blocks.push({ type: 'table', headers, rows })
      continue
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/)
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: Math.min(headingMatch[1].length, 3),
        content: headingMatch[2],
      })
      index += 1
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = []

      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''))
        index += 1
      }

      blocks.push({ type: 'list', ordered: false, items })
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = []

      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''))
        index += 1
      }

      blocks.push({ type: 'list', ordered: true, items })
      continue
    }

    if (/^-{3,}$/.test(trimmed)) {
      blocks.push({ type: 'rule' })
      index += 1
      continue
    }

    const paragraphLines = [trimmed]
    index += 1

    while (
      index < lines.length
      && lines[index].trim()
      && !lines[index].trim().startsWith('```')
      && !lines[index].trim().match(/^(#{1,4})\s+/)
      && !/^[-*]\s+/.test(lines[index].trim())
      && !/^\d+\.\s+/.test(lines[index].trim())
      && !(isTableRow(lines[index].trim()) && isTableDivider(lines[index + 1] || ''))
    ) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }

    blocks.push({ type: 'paragraph', content: paragraphLines.join(' ') })
  }

  return blocks
}

function MarkdownBlock({ block, index }) {
  if (block.type === 'heading') {
    const HeadingTag = `h${block.level + 2}`
    return <HeadingTag className="review-heading">{renderInline(block.content)}</HeadingTag>
  }

  if (block.type === 'code') {
    return (
      <pre className="output-code">
        {block.language && <span className="code-language">{block.language}</span>}
        <code>{block.content}</code>
      </pre>
    )
  }

  if (block.type === 'table') {
    return (
      <div className="review-table-wrap">
        <table className="review-table">
          <thead>
            <tr>
              {block.headers.map((header, cellIndex) => (
                <th key={`${index}-head-${cellIndex}`}>{renderInline(header)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`${index}-row-${rowIndex}`}>
                {block.headers.map((_, cellIndex) => (
                  <td key={`${index}-cell-${rowIndex}-${cellIndex}`}>
                    {renderInline(row[cellIndex] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (block.type === 'list') {
    const ListTag = block.ordered ? 'ol' : 'ul'
    return (
      <ListTag className="review-list">
        {block.items.map((item, itemIndex) => (
          <li key={`${index}-item-${itemIndex}`}>{renderInline(item)}</li>
        ))}
      </ListTag>
    )
  }

  if (block.type === 'rule') {
    return <hr className="review-rule" />
  }

  return <p className="output-text">{renderInline(block.content)}</p>
}

function ReviewOutput({ reply, loading }) {
  if (loading) {
    return (
      <div className="output-box output-loading">
        <span className="spinner" aria-label="Loading" />
        <p>Reviewing your code...</p>
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

  const blocks = parseBlocks(reply)

  return (
    <div className="output-box output-content">
      {blocks.map((block, index) => (
        <MarkdownBlock key={`${block.type}-${index}`} block={block} index={index} />
      ))}
    </div>
  )
}

export default ReviewOutput
