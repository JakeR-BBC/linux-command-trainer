import { useState, useRef, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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
import Accessibility from './components/Accessibility'
import FocusList from './components/FocusList'
import { saveResult } from './utils/results'
import { getFocusList } from './utils/focusList'

function DrillScreen() {
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const selected = params.get('category')
  const mode = params.get('mode')
  const isAll = selected === 'all'

  function getActivePool() {
    if (selected === 'focus') {
      const list = getFocusList()
      const base = commands.filter(c => list.includes(c.id))
      if (mode === 'realism' || mode === 'mastery') {
        return base.filter(cmd => cmd.challenges?.some(ch => ch.mode === mode))
      }
      return base
    }
    const base = isAll ? commands : commands.filter(c => c.category === selected)
    const withChallenges = (mode === 'realism' || mode === 'mastery')
      ? base.filter(cmd => cmd.challenges?.some(ch => ch.mode === mode))
      : base
    return withChallenges
  }

  // Refs for values that need to be current inside callbacks
  const seenRef = useRef(new Set())
  const correctRef = useRef(0)
  const incorrectRef = useRef(0)
  const skippedRef = useRef(0)
  const macTimeoutRef = useRef(null)
  const finalResultRef = useRef(null)

  // State for UI rendering only
  const [command, setCommand] = useState(() => {
    const pool = getActivePool()
    if (pool.length === 0) return null
    return pool[Math.floor(Math.random() * pool.length)]
  })
  const [feedback, setFeedback] = useState(null)
  const [attempts, setAttempts] = useState({})
  const [sessionComplete, setSessionComplete] = useState(false)
  const [newBest, setNewBest] = useState(false)
  const [showMacPopup, setShowMacPopup] = useState(false)
  const [incorrectIds, setIncorrectIds] = useState([])
  const [questionNumber, setQuestionNumber] = useState(1)

  useEffect(() => {
    const total = getActivePool().length
    const current = Math.min(questionNumber, total)
    const newParams = new URLSearchParams(window.location.search)
    newParams.set('current', current)
    newParams.set('total', total)
    window.history.replaceState(null, '', `?${newParams.toString()}`)
    window.dispatchEvent(new Event('locationchange'))
  }, [questionNumber])

  useEffect(() => {
    function handleKeyDown(e) {
      if (document.body.classList.contains('nav-focused')) return
      if (e.key === 'Escape') navigate(`/modes?category=${selected}`)
      if (e.key === 'Tab') {
        e.preventDefault()
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selected, sessionComplete, command])

  function nextCommand(currentId) {
    const pool = getActivePool()
    const unseen = pool.filter(c => c.id !== currentId && !seenRef.current.has(c.id))
    if (unseen.length === 0) return null
    return unseen[Math.floor(Math.random() * unseen.length)]
  }

  function endSession() {
    const total = seenRef.current.size
    const accuracy = total > 0 ? Math.round((correctRef.current / total) * 100) : 0
    const result = {
      correct: correctRef.current,
      incorrect: incorrectRef.current,
      skipped: skippedRef.current,
      accuracy,
      total
    }
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
      seenRef.current.add(command.id)
      correctRef.current += 1

      if (!command.mac_compatible) setShowMacPopup(true)

      macTimeoutRef.current = setTimeout(() => {
        setQuestionNumber(prev => prev + 1)
        const next = nextCommand(command.id)
        if (!next) {
          endSession()
        } else {
          setCommand(next)
          setFeedback(null)
        }
      }, command.mac_compatible ? 1000 : 5000)

    } else {
      const currentAttempts = (attempts[command.id] || 0) + 1
      setAttempts(prev => ({ ...prev, [command.id]: currentAttempts }))

      if (mode === 'recognition' || currentAttempts >= 2) {
        seenRef.current.add(command.id)
        incorrectRef.current += 1
        setIncorrectIds(prev => [...new Set([...prev, command.id])])

        setTimeout(() => {
          setQuestionNumber(prev => prev + 1)
          const next = nextCommand(command.id)
          if (!next) {
            endSession()
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
    if (!seenRef.current.has(command.id)) {
      seenRef.current.add(command.id)
      skippedRef.current += 1
    }
    setQuestionNumber(prev => prev + 1)
    const next = nextCommand(command.id)
    if (!next) {
      endSession()
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
        incorrectIds={incorrectIds}
        onRetry={() => navigate(`/drill?mode=${mode}&category=${selected}&t=${Date.now()}`)}
        onContinue={() => {
          if (selected === 'focus') {
            navigate('/focus')
          } else {
            navigate(`/onwards?mode=${mode}&category=${selected}&score=${accuracy}&complete=true`)
          }
        }}
      />
    )
  }

  if (!command) return null

  return (
    <div>
      <h1>Linux Command Trainer</h1>
      <p className="prompt">
        {mode === 'scenario' ? command.scenario
          : mode === 'realism' || mode === 'mastery'
            ? command.challenges?.find(ch => ch.mode === mode)?.prompt
            : command.short_desc}
      </p>
      <MacBadge
        command={command}
        show={showMacPopup}
        onDismiss={() => {
          setShowMacPopup(false)
          if (macTimeoutRef.current) {
            clearTimeout(macTimeoutRef.current)
            const next = nextCommand(command.id)
            if (!next) {
              endSession()
            } else {
              setCommand(next)
              setFeedback(null)
            }
          }
        }}
      />
      {mode === 'recognition'
        ? <RecognitionCard
            command={command}
            pool={getActivePool()}
            onSubmit={handleSubmit}
            disabled={sessionComplete}
          />
        : mode === 'realism' || mode === 'mastery'
          ? <ChallengeCard
              challenge={command.challenges?.find(ch => ch.mode === mode)}
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
            ← Back to modes <span className="key-hint">Esc</span>
          </span>
          <span className="skip-btn" onClick={handleSkip}>
            Skip question → <span className="key-hint">Tab</span>
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
      <main className="app-main" tabIndex={-1} style={{ outline: 'none' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/category" element={<CategorySelect />} />
          <Route path="/modes" element={<ModeSelect />} />
          <Route path="/drill" element={<DrillScreenWrapper />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/onwards" element={<Onwards />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/focus" element={<FocusList />} />
        </Routes>
      </main>
    </div>
  )
}

export default App