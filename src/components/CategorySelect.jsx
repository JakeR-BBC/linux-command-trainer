import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import commands from '../commands.json'

function CategorySelect() {
  const navigate = useNavigate()
  const categories = [...new Set(commands.map(c => c.category))]
  const allItems = [...categories, 'all']
  const [focusedIndex, setFocusedIndex] = useState(null)
  const gridRef = useRef(null)

  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  function getCount(category) {
    return commands.filter(c => c.category === category).length
  }

  function handleNavigate(category) {
    navigate(`/modes?category=${category}`)
  }

  function getRows() {
    if (!gridRef.current) return []
    const children = Array.from(gridRef.current.children)
    const rows = []
    let currentRow = []
    let currentTop = null

    children.forEach((child, index) => {
      const top = child.getBoundingClientRect().top
      if (currentTop === null || Math.abs(top - currentTop) < 5) {
        currentRow.push(index)
        currentTop = top
      } else {
        rows.push(currentRow)
        currentRow = [index]
        currentTop = top
      }
    })
    if (currentRow.length) rows.push(currentRow)
    return rows
  }

  function getNextIndex(current, direction) {
    const rows = getRows()
    let currentRowIndex = -1
    let posInRow = -1

    for (let r = 0; r < rows.length; r++) {
      const pos = rows[r].indexOf(current)
      if (pos !== -1) {
        currentRowIndex = r
        posInRow = pos
        break
      }
    }

    if (currentRowIndex === -1) return current

    if (direction === 'down') {
      if (currentRowIndex >= rows.length - 1) return current
      const nextRow = rows[currentRowIndex + 1]
      const ratio = posInRow / rows[currentRowIndex].length
      const nextPos = Math.floor(ratio * nextRow.length)
      return nextRow[Math.min(nextPos, nextRow.length - 1)]
    }

    if (direction === 'up') {
      if (currentRowIndex === 0) return current
      const prevRow = rows[currentRowIndex - 1]
      const ratio = posInRow / rows[currentRowIndex].length
      const prevPos = Math.floor(ratio * prevRow.length)
      return prevRow[Math.min(prevPos, prevRow.length - 1)]
    }

    return current
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
        e.preventDefault()
      }

      if (e.key === 'ArrowRight') {
        setFocusedIndex(prev => {
          const current = prev === null ? 0 : prev
          return Math.min(current + 1, allItems.length - 1)
        })
      }
      if (e.key === 'ArrowLeft') {
        setFocusedIndex(prev => {
          const current = prev === null ? 0 : prev
          return Math.max(current - 1, 0)
        })
      }
      if (e.key === 'ArrowDown') {
        setFocusedIndex(prev => {
          const current = prev === null ? 0 : prev
          return getNextIndex(current, 'down')
        })
      }
      if (e.key === 'ArrowUp') {
        setFocusedIndex(prev => {
          const current = prev === null ? 0 : prev
          return getNextIndex(current, 'up')
        })
      }
      if (e.key === 'Enter' && focusedIndex !== null) {
        handleNavigate(allItems[focusedIndex])
      }
      if (e.key === 'Escape') {
        navigate('/')
      }
    }

    function handleMouseMove() {
      setFocusedIndex(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [focusedIndex])

  return (
    <div className="category-select">
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Pick a category to drill — <span className="key-hint">arrow keys to navigate, ↵ to select, Esc to go back</span></p>
      <div className="category-grid" ref={gridRef}>
        {categories.map((category, index) => (
          <button
            key={category}
            className={`category-btn ${focusedIndex === index ? 'keyboard-focused' : ''}`}
            onClick={() => handleNavigate(category)}
          >
            {capitalise(category)}
            <span className="count">({getCount(category)})</span>
          </button>
        ))}
        <button
          className={`category-btn all ${focusedIndex === allItems.length - 1 ? 'keyboard-focused' : ''}`}
          onClick={() => handleNavigate('all')}
        >
          All Commands
          <span className="count">({commands.length})</span>
        </button>
      </div>
      <div className="drill-footer">
        <span className="back-btn" onClick={() => navigate('/')}>
          ← Home <span className="key-hint">Esc</span>
        </span>
      </div>
    </div>
  )
}

export default CategorySelect