import { useState, useRef, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import DrillCard from './components/DrillCard'
import CategorySelect from './components/CategorySelect'
import ModeSelect from './components/ModeSelect'
import commands from './commands.json'
import RecognitionCard from './components/RecognitionCard'
import NavRail from './components/NavRail'
import MacBadge from './components/MacBadge'
import ChallengeCard from './components/ChallengeCard'
import ResultsScreen from './components/ResultsScreen'
import ProgressPage from './components/ProgressPage'
import Onwards from './components/Onwards'
import Library from './components/Library'
import Landing from './components/Landing'
import { saveResult } from './utils/results'

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

    const withChallenges = (mode === 'realism' || mode === 'mastery')
      ? base.filter(cmd => cmd.challenges?.some(ch => ch.mode === mode))
      : base

    return withChallenges
  }

  const [command, setCommand] = useState(() => {
    const pool = getActivePool()
    if (pool.length === 0) return null
    return pool[Math.floor(Math.random() * pool.length)]
  })
  const [feedback, setFeedback] = useState(null)
  const macTimeoutRef = useRef(null)
  const [seen, setSeen] = useState(new Set())
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [skipped, setSkipped] = useState(0)
  const [attempts, setAttempts] = useState({})
  const [sessionComplete, setSessionComplete] = useState(false)
  const [newBest, setNewBest] = useState(false)
  const [showMacPopup, setShowMacPopup] = useState(false)
  const finalResultRef = useRef(null)

  useEffect(() => {
    const total = getActivePool().length
    const current = Math.min(seen.size + 1, total)
    const newParams = new URLSearchParams(window.location.search)
    newParams.set('current', current)
    newParams.set('total', total)
    window.history.replaceState(null, '', `?${newParams.toString()}`)
    window.dispatchEvent(new Event('locationchange'))
  }, [seen])

  function nextCommand(currentId, seenOverride) {
    const pool = getActivePool()
    const seenSet = seenOverride || seen
    const unseen = pool.filter(c => c.id !== currentId && !seenSet.has(c.id))
    if (unseen.length === 0) return null
    return unseen[Math.floor(Math.random() * unseen.length)]
  }

  function endSession(finalCorrect, finalIncorrect, finalSkipped, finalSeen) {
    const total = finalSeen.size
    const accuracy = total > 0 ? Math.round((finalCorrect / total) * 100) : 0
    const result = { correct: finalCorrect, incorrect: finalIncorrect, skipped: finalSkipped, accuracy, total }
    const isNewBest = saveResult(mode, selected, result)
    finalResultRef.current = result
    setNewBest(isNewBest)
    const newParams = new URLSearchParams(window.location.search)
    newParams.set('complete', 'true')
    window.history.replaceState(null, '', `?${newParams.toString()}`)
    window.dispatchEvent(new Event('locationchange'))
    setSessionComplete(true)
  }

  function handleSubmit(isCorrect) {
    if (sessionComplete) return
    setFeedback(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      const updatedSeen = new Set(seen).add(command.id)
      setSeen(updatedSeen)
      const newCorrect = correct + 1
      setCorrect(newCorrect)

      if (!command.mac_compatible) {
        setShowMacPopup(true)
      }

      macTimeoutRef.current = setTimeout(() => {
        const next = nextCommand(command.id, updatedSeen)
        if (!next) {
          endSession(newCorrect, incorrect, skipped, updatedSeen)
        } else {
          setCommand(next)
          setFeedback(null)
        }
      }, command.mac_compatible ? 1000 : 5000)

    } else {
      const currentAttempts = (attempts[command.id] || 0) + 1
      setAttempts(prev => ({ ...prev, [command.id]: currentAttempts }))

      if (mode === 'recognition' || currentAttempts >= 2) {
        const updatedSeen = new Set(seen).add(command.id)
        setSeen(updatedSeen)
        const newIncorrect = incorrect + 1
        setIncorrect(newIncorrect)

        setTimeout(() => {
          const next = nextCommand(command.id, updatedSeen)
          if (!next) {
            endSession(correct, newIncorrect, skipped, updatedSeen)
          } else {
            setCommand(next)
            setFeedback(null)
          }
        }, 1500)
      }
    }
  }

  function handleSkip() {
    if (sessionComplete) return
    const updatedSeen = new Set(seen).add(command.id)
    setSeen(updatedSeen)
    const newSkipped = skipped + 1
    setSkipped(newSkipped)
    const next = nextCommand(command.id, updatedSeen)
    if (!next) {
      endSession(correct, incorrect, newSkipped, updatedSeen)
    } else {
      setCommand(next)
      setFeedback(null)
      setShowMacPopup(false)
    }
  }

  if (sessionComplete && finalResultRef.current) {
    const { correct: fc, incorrect: fi, skipped: fs, accuracy } = finalResultRef.current
    return (
      <ResultsScreen
        mode={mode}
        category={selected}
        correct={fc}
        incorrect={fi}
        skipped={fs}
        newBest={newBest}
        onRetry={() => navigate(`/drill?mode=${mode}&category=${selected}&t=${Date.now()}`)}
        onContinue={() => navigate(`/onwards?mode=${mode}&category=${selected}&score=${accuracy}`)}
      />
    )
  }

  if (!command) return null

  return (
    <div>
      <h1>Linux Command Trainer</h1>
      <p className="prompt">
        {mode === 'scenario' ? command.scenario
          : mode === 'realism' || mode === 'mastery' ? command.challenges?.find(c => c.mode === mode)?.prompt
            : command.short_desc}
      </p>
      <MacBadge
        command={command}
        show={showMacPopup}
        onDismiss={() => {
          setShowMacPopup(false)
          if (macTimeoutRef.current) {
            clearTimeout(macTimeoutRef.current)
            const updatedSeen = new Set(seen)
            const next = nextCommand(command.id, updatedSeen)
            if (!next) {
              endSession(correct, incorrect, skipped, updatedSeen)
            } else {
              setCommand(next)
              setFeedback(null)
            }
          }
        }}
      />
      {mode === 'recognition'
        ? <RecognitionCard command={command} pool={getActivePool()} onSubmit={handleSubmit} />
        : mode === 'realism' || mode === 'mastery'
          ? <ChallengeCard
            challenge={command.challenges?.find(c => c.mode === mode)}
            onSubmit={handleSubmit}
          />
          : <DrillCard command={command} onSubmit={handleSubmit} disabled={false} />
      }
      {feedback && (
        <p className={`feedback ${feedback}`}>
          {feedback === 'correct' ? '✅ Correct!' : '❌ Wrong, try again'}
        </p>
      )}
      <div className="drill-footer">
        <div className="drill-footer-nav">
          <span className="back-btn" onClick={() => navigate(`/modes?category=${selected}`)}>
            ← Back to modes
          </span>
          <span className="skip-btn" onClick={handleSkip}>
            Skip question →
          </span>
        </div>
      </div>
    </div>
  )
}

function DrillScreenWrapper() {
  const location = useLocation()
  return <DrillScreen key={location.search} />
}

function App() {
  return (
    <div className="app-layout">
      <NavRail />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/category" element={<CategorySelect />} />
          <Route path="/modes" element={<ModeSelect />} />
          <Route path="/drill" element={<DrillScreenWrapper />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/onwards" element={<Onwards />} />
        </Routes>
      </main>
    </div>
  )
}

export default App