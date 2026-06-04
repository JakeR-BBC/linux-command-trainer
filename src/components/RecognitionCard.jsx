import { useState, useEffect } from 'react'
import commands from '../commands.json'

function getWrongOptions(correct, pool) {
  const others = pool.filter(c => c.id !== correct.id)
  const shuffled = others.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5)
}

function RecognitionCard({ command, pool, onSubmit }) {
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const wrong = getWrongOptions(command, pool)
    const all = shuffle([command, ...wrong])
    setOptions(all)
    setSelected(null)
  }, [command])

  function handleSelect(option) {
    if (selected) return
    const isCorrect = option.id === command.id
    setSelected(option.id)
    onSubmit(isCorrect)
  }

  function getButtonClass(option) {
    if (!selected) return 'option-btn'
    if (option.id === command.id) return 'option-btn correct'
    if (option.id === selected) return 'option-btn incorrect'
    return 'option-btn dimmed'
  }

  return (
    <div className="recognition-card">
      <div className="options-grid">
        {options.map(option => (
          <button
            key={option.id}
            className={getButtonClass(option)}
            onClick={() => handleSelect(option)}
          >
            {option.command}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RecognitionCard