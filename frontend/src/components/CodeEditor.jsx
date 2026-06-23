import './styles/CodeEditor.css'

const LANGUAGES = ['javascript', 'python', 'java', 'typescript', 'c', 'cpp', 'go', 'rust']

function CodeEditor({ code, language, onCodeChange, onLanguageChange }) {
  return (
    <>
      <div className="editor-header">
        <label htmlFor="lang-select" className="editor-label">Language</label>
        <select
          id="lang-select"
          className="lang-select"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {}
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="code-textarea"
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder={`// Paste your ${language} code here…`}
        spellCheck={false}
        aria-label="Code input"
      />
    </>
  )
}

export default CodeEditor