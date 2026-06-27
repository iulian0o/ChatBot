import { useState } from "react";
import "./styles/InputBar.css";

const LANGUAGES = [
  "javascript",
  "python",
  "java",
  "typescript",
  "c",
  "cpp",
  "go",
  "rust",
];

function InputBar({ onSend, disabled, language, onLanguageChange }) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed, language);
    setValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="inputbar">
      <select
        className="inputbar-lang"
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={disabled}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </option>
        ))}
      </select>

      <textarea
        className="inputbar-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste code or ask a follow-up… (Enter to send)"
        disabled={disabled}
        rows={3}
      />

      <button
        className="inputbar-btn"
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
      >
        Send
      </button>
    </div>
  );
}

export default InputBar;
