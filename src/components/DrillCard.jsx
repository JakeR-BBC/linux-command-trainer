import { useState, useEffect, useRef } from 'react'

function DrillCard({ command, onSubmit, disabled }) {
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [disabled, command])

  function handleSubmit() {
    if (!input.trim() || disabled) return
    const trimmed = input.trim().toLowerCase()
    const correct = command.command.toLowerCase()
    const isCorrect = trimmed === correct
    onSubmit(isCorrect)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="terminal">
      <div className="terminal-titlebar">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
      </div>
      <div className="terminal-body">
        <span className="terminal-prompt">user@linux:~$</span>
        <input
          ref={inputRef}
          className="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? '' : 'type a command...'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default DrillCard