import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import commands from '../commands.json'

function CategorySelect() {
  const navigate = useNavigate()
  const categories = [...new Set(commands.map(c => c.category))]
  const allItems = [...categories, 'all']
  const [focusedIndex, setFocusedIndex] = useState(null)
  const [homeButtonFocused, setHomeButtonFocused] = useState(false)
  const [keyboardNav, setKeyboardNav] = useState(false)
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
      if (currentRowIndex >= rows.length - 1) return null
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

  const isOnAllRow = focusedIndex === allItems.length - 1

  useEffect(() => {
    function handleKeyDown(e) {
      if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
        e.preventDefault()
        setKeyboardNav(true)
        document.body.classList.add('keyboard-nav-active')
      }

      if (e.key === 'ArrowRight') {
        if (homeButtonFocused) return
        setFocusedIndex(prev => {
          const current = prev === null ? 0 : prev
          return Math.min(current + 1, allItems.length - 1)
        })
      }

      if (e.key === 'ArrowLeft') {
        if (homeButtonFocused) return
        setFocusedIndex(prev => {
          const current = prev === null ? 0 : prev
          return Math.max(current - 1, 0)
        })
      }

      if (e.key === 'ArrowDown') {
        if (homeButtonFocused) return
        if (isOnAllRow) {
          setFocusedIndex(null)
          setHomeButtonFocused(true)
          return
        }
        setFocusedIndex(prev => {
          const current = prev === null ? 0 : prev
          const next = getNextIndex(current, 'down')
          return next === null ? allItems.length - 1 : next
        })
      }

      if (e.key === 'ArrowUp') {
        if (homeButtonFocused) {
          setHomeButtonFocused(false)
          setFocusedIndex(allItems.length - 1)
          return
        }
        setFocusedIndex(prev => {
          const current = prev === null ? 0 : prev
          return getNextIndex(current, 'up')
        })
      }

      if (e.key === 'Enter') {
        if (homeButtonFocused) { navigate('/'); return }
        if (focusedIndex !== null) handleNavigate(allItems[focusedIndex])
      }

      if (e.key === 'Escape') {
        if (homeButtonFocused) { setHomeButtonFocused(false); return }
        navigate('/')
      }
    }

    function handleMouseMove() {
      setFocusedIndex(null)
      setHomeButtonFocused(false)
      setKeyboardNav(false)
      document.body.classList.remove('keyboard-nav-active')
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.classList.remove('keyboard-nav-active')
    }
  }, [focusedIndex, homeButtonFocused, isOnAllRow])

  return (
    <div className={`category-select ${keyboardNav ? 'keyboard-nav' : ''}`}>
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Pick a category to drill — <span className="key-hint">arrow keys to navigate, ↵ to select, Esc to go back</span></p>
      <div className="category-grid" ref={gridRef}>
        {categories.map((category, index) => (
          <button
            key={category}
            className={`category-btn ${focusedIndex === index && !homeButtonFocused ? 'keyboard-focused' : ''}`}
            onClick={() => handleNavigate(category)}
          >
            {capitalise(category)}
            <span className="count">({getCount(category)})</span>
          </button>
        ))}
        <button
          className={`category-btn all ${focusedIndex === allItems.length - 1 && !homeButtonFocused ? 'keyboard-focused' : ''}`}
          onClick={() => handleNavigate('all')}
        >
          All Commands
          <span className="count">({commands.length})</span>
        </button>
      </div>
      <div className="drill-footer">
        <span
          className={`back-btn ${homeButtonFocused ? 'keyboard-focused' : ''}`}
          onClick={() => navigate('/')}
        >
          ← Home <span className="key-hint">Esc</span>
        </span>
      </div>
    </div>
  )
}

export default CategorySelect