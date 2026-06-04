import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import DrillCard from './components/DrillCard'
import CategorySelect from './components/CategorySelect'
import commands from './commands.json'

function getRandomCommand(pool, currentId) {
  const others = pool.filter(c => c.id !== currentId)
  return others[Math.floor(Math.random() * others.length)]
}

function DrillScreen() {
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const selected = params.get('category')

  const pool = selected === 'all'
    ? commands
    : commands.filter(c => c.category === selected)

  const [command, setCommand] = useState(pool[Math.floor(Math.random() * pool.length)])
  const [feedback, setFeedback] = useState(null)

  function handleSubmit(isCorrect) {
    setFeedback(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      setTimeout(() => {
        setCommand(getRandomCommand(pool, command.id))
        setFeedback(null)
      }, 1000)
    }
  }

  return (
    <div>
      <h1>Linux Command Trainer</h1>
      <p className="prompt">{command.short_desc}</p>
      <DrillCard command={command} onSubmit={handleSubmit} />
      {feedback && (
        <p className={`feedback ${feedback}`}>
          {feedback === 'correct' ? '✅ Correct!' : '❌ Wrong, try again'}
        </p>
      )}
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Back to categories
      </button>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<CategorySelect />} />
      <Route path="/drill" element={<DrillScreen />} />
    </Routes>
  )
}

export default App