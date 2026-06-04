import { useState } from 'react'

const PASSKEY = 'GroundskeeperWillie2026'
const STORAGE_KEY = 'linux_trainer_unlocked'

export function isUnlocked() {
  return localStorage.getItem(STORAGE_KEY) === 'true'
}

function Passkey({ onUnlock }) {
  const [input, setInput] = useState('')
  const [failed, setFailed] = useState(false)

  function handleSubmit() {
    if (input.trim().toLowerCase() === PASSKEY.toLowerCase()) {
      localStorage.setItem(STORAGE_KEY, 'true')
      onUnlock()
    } else {
      setFailed(true)
      setInput('')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="passkey-screen">
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Enter passkey to continue</p>
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
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="enter passkey..."
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>
      {failed && (
        <p className="feedback incorrect">❌ Incorrect passkey, try again</p>
      )}
    </div>
  )
}

export default Passkey