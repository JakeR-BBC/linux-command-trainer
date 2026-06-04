import { useState } from 'react'
import DrillCard from './components/DrillCard'
import commands from './commands.json'

function getRandomCommand(currentId) {
  const others = commands.filter(c => c.id !== currentId)
  return others[Math.floor(Math.random() * others.length)]
}

function App() {
  const [command, setCommand] = useState(commands[0])
  const [feedback, setFeedback] = useState(null)

  function handleSubmit(isCorrect) {
    setFeedback(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      setTimeout(() => {
        setCommand(getRandomCommand(command.id))
        setFeedback(null)
      }, 1000)
    }
  }

  return (
    <div>
      <h1>Linux Command Trainer</h1>
      <DrillCard command={command} onSubmit={handleSubmit} />
      {feedback && <p>{feedback === 'correct' ? '✅ Correct!' : '❌ Wrong, try again'}</p>}
    </div>
  )
}

export default App