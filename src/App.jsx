import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import DrillCard from './components/DrillCard'
import CategorySelect from './components/CategorySelect'
import ModeSelect from './components/ModeSelect'
import commands from './commands.json'
import RecognitionCard from './components/RecognitionCard'
import {
  incrementCorrect,
  retireCommand,
  restoreCategory,
  isRetired,
  getRetiredCount
} from './utils/progress'

function getRandomCommand(pool, currentId) {
  const others = pool.filter(c => c.id !== currentId)
  return others[Math.floor(Math.random() * others.length)]
}

function DrillScreen() {
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const selected = params.get('category')
  const mode = params.get('mode')
  const isAll = selected === 'all'

  function getActivePool() {
    const base = isAll
      ? commands
      : commands.filter(c => c.category === selected)
    if (isAll) return base
    return base.filter(cmd => !isRetired(cmd.id, selected))
  }

  const [command, setCommand] = useState(() => {
    const pool = getActivePool()
    if (pool.length === 0) return null
    return pool[Math.floor(Math.random() * pool.length)]
  })
  const [feedback, setFeedback] = useState(null)
  const [retirePrompt, setRetirePrompt] = useState(false)
  const [retiredCount, setRetiredCount] = useState(() =>
    isAll ? 0 : getRetiredCount(selected, commands.filter(c => c.category === selected))
  )

  function nextCommand(excludeId) {
    const pool = getActivePool()
    const others = pool.filter(c => c.id !== excludeId)
    if (others.length === 0) return null
    return others[Math.floor(Math.random() * others.length)]
  }

function handleSubmit(isCorrect) {
    setFeedback(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      const newCount = incrementCorrect(command.id)
      const pool = getActivePool()
      const isLastCommand = pool.filter(c => c.id !== command.id).length === 0

      if (!isAll && isLastCommand && mode === 'recognition') {
        retireCommand(command.id, selected)
        setTimeout(() => {
          navigate(`/category?mode=${mode}`)
        }, 1000)
      } else if (!isAll && newCount >= 3) {
        setRetirePrompt(true)
      } else {
        setTimeout(() => {
          setCommand(nextCommand(command.id))
          setFeedback(null)
        }, 1000)
      }
    } else {
      if (mode === 'recognition') {
        setTimeout(() => {
          setCommand(nextCommand(command.id))
          setFeedback(null)
        }, 1500)
      }
    }
  }

  function handleRetire(shouldRetire) {
    if (shouldRetire) {
      retireCommand(command.id, selected)
      const newRetiredCount = retiredCount + 1
      setRetiredCount(newRetiredCount)
      const next = nextCommand(command.id)
      if (!next) {
        navigate('/')
      } else {
        setCommand(next)
      }
    } else {
      setTimeout(() => {
        setCommand(nextCommand(command.id))
      }, 500)
    }
    setRetirePrompt(false)
    setFeedback(null)
  }

  function handleRestore() {
    const categoryCommands = commands.filter(c => c.category === selected)
    restoreCategory(selected, categoryCommands)
    setRetiredCount(0)
    const pool = commands.filter(c => c.category === selected)
    setCommand(pool[Math.floor(Math.random() * pool.length)])
    setFeedback(null)
    setRetirePrompt(false)
  }

  if (!command) {
    return (
      <div className="completed-screen">
        <h1>Linux Command Trainer</h1>
        <div className="retire-prompt">
          <p>🎉 You've nailed every command in this category!</p>
          <div className="retire-actions">
            <button className="retire-btn yes" onClick={handleRestore}>
              Reset category
            </button>
            <button className="retire-btn no" onClick={() => navigate('/')}>
              ← Back to categories
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Linux Command Trainer</h1>
      <p className="prompt">{mode === 'scenario' ? command.scenario : command.short_desc}</p>
      {mode === 'recognition'
  ? <RecognitionCard command={command} pool={getActivePool()} onSubmit={handleSubmit} />
  : <DrillCard command={command} onSubmit={handleSubmit} disabled={retirePrompt} />
}
      {feedback && !retirePrompt && (
        <p className={`feedback ${feedback}`}>
          {feedback === 'correct' ? '✅ Correct!' : '❌ Wrong, try again'}
        </p>
      )}
      {retirePrompt && (
        <div
          className="retire-prompt"
          tabIndex={0}
          ref={el => el && el.focus()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRetire(true)
            if (e.key === 'Backspace') handleRetire(false)
          }}
        >
          <p>You've nailed <span className="highlight">{command.command}</span> 3 times — retire it from this category for now?</p>
          <div className="retire-actions">
            <button className="retire-btn yes" onClick={() => handleRetire(true)}>
              Yes, retire it <span className="key-hint">↵ Enter</span>
            </button>
            <button className="retire-btn no" onClick={() => handleRetire(false)}>
              Keep drilling it <span className="key-hint">⌫ Backspace</span>
            </button>
          </div>
        </div>
      )}
      <div className="drill-footer">
        {!isAll && retiredCount > 0 && (
          <button className="restore-btn" onClick={handleRestore}>
            Restore retired commands ({retiredCount})
          </button>
        )}
        <span className="back-btn" onClick={() => navigate(`/category?mode=${mode}`)}>
  ← Back to categories
</span>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ModeSelect />} />
      <Route path="/category" element={<CategorySelect />} />
      <Route path="/drill" element={<DrillScreen />} />
    </Routes>
  )
}

export default App