import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import DrillCard from './components/DrillCard'
import CategorySelect from './components/CategorySelect'
import ModeSelect from './components/ModeSelect'
import commands from './commands.json'
import RecognitionCard from './components/RecognitionCard'
import NavRail from './components/NavRail'
import MacBadge from './components/MacBadge'
import ChallengeCard from './components/ChallengeCard'
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
  const [showMacPopup, setShowMacPopup] = useState(false)


  function getActivePool() {
    const base = isAll
      ? commands
      : commands.filter(c => c.category === selected)

    const withChallenges = (mode === 'realism' || mode === 'mastery')
      ? base.filter(cmd => cmd.challenges?.some(ch => ch.mode === mode))
      : base

    if (isAll) return withChallenges
    return withChallenges.filter(cmd => !isRetired(cmd.id, selected))
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
      if (!command.mac_compatible) {
        setShowMacPopup(true)
      }

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
        }, command.mac_compatible ? 1000 : 5000)
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
    setShowMacPopup(false)
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

  function handleSkip() {
    setCommand(nextCommand(command.id))
    setFeedback(null)
    setRetirePrompt(false)
    setShowMacPopup(false)
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
      <p className="prompt">
        {mode === 'scenario' ? command.scenario
          : mode === 'realism' || mode === 'mastery' ? command.challenges?.find(c => c.mode === mode)?.prompt
            : command.short_desc}
      </p>
      <MacBadge command={command} show={showMacPopup} onDismiss={() => setShowMacPopup(false)} />
      {mode === 'recognition'
        ? <RecognitionCard command={command} pool={getActivePool()} onSubmit={handleSubmit} />
        : mode === 'realism' || mode === 'mastery'
          ? <ChallengeCard
            challenge={command.challenges?.find(c => c.mode === mode)}
            onSubmit={handleSubmit}
          />
          : <DrillCard command={command} onSubmit={handleSubmit} disabled={retirePrompt} />
      }
      {feedback && !retirePrompt && (
        <p className={`feedback ${feedback}`}>
          {feedback === 'correct' ? '✅ Correct!' : '❌ Wrong, try again'}
        </p>
      )}
      {retirePrompt && (
        <div
          className={`retire-prompt ${showMacPopup ? 'blocked' : ''}`}
          tabIndex={showMacPopup ? -1 : 0}
          ref={el => el && !showMacPopup && el.focus()}
          onKeyDown={(e) => {
            if (showMacPopup) return
            if (e.key === 'Enter') handleRetire(true)
            if (e.key === 'Backspace') handleRetire(false)
          }}
        >
          <p>You've nailed <span className="highlight">{command.command}</span> 3 times — retire it from this category for now?</p>
          <div className="retire-actions">
            <button className="retire-btn yes" onClick={() => !showMacPopup && handleRetire(true)}>
              Yes, retire it <span className="key-hint">↵ Enter</span>
            </button>
            <button className="retire-btn no" onClick={() => !showMacPopup && handleRetire(false)}>
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
        <div className="drill-footer-nav">
          <span className="back-btn" onClick={() => navigate(`/category?mode=${mode}`)}>
            ← Back to categories
          </span>
          <span className="skip-btn" onClick={handleSkip}>
            Skip question →
          </span>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="app-layout">
      <NavRail />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ModeSelect />} />
          <Route path="/category" element={<CategorySelect />} />
          <Route path="/drill" element={<DrillScreen />} />
        </Routes>
      </main>
    </div>
  )
}

export default App