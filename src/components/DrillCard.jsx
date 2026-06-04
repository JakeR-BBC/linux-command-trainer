import { useState } from 'react'

function DrillCard({ command, onSubmit }) {
  const [input, setInput] = useState('')

  function handleSubmit() {
    if (!input.trim()) return
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
    <div className="drill-card">
      <p className="prompt">{command.short_desc}</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type the command..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default DrillCard