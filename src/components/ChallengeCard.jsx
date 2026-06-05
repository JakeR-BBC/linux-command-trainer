import { useState } from 'react'

function ChallengeCard({ challenge, onSubmit }) {
  const [input, setInput] = useState('')

  function handleSubmit() {
    if (!input.trim()) return
    const trimmed = input.trim().toLowerCase()
    const isCorrect = challenge.valid_answers.some(
      answer => answer.toLowerCase() === trimmed
    )
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
          className="terminal-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type full command..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoFocus
        />
      </div>
    </div>
  )
}

export default ChallengeCard