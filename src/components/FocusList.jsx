import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import commands from '../commands.json'
import { getFocusList, removeFromFocusList, clearFocusList } from '../utils/focusList'

function capitalise(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function FocusList() {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const [list, setList] = useState(getFocusList())
  const [focusedIndex, setFocusedIndex] = useState(null)
  const [removeButtonFocused, setRemoveButtonFocused] = useState(false)
  const [drillButtonFocused, setDrillButtonFocused] = useState(false)
  const [clearButtonFocused, setClearButtonFocused] = useState(false)
  const [homeButtonFocused, setHomeButtonFocused] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(null)

  const focusedCommands = commands.filter(c => list.includes(c.id))
  const isOnLastItem = focusedIndex === focusedCommands.length - 1

  useEffect(() => {
    if (containerRef.current) containerRef.current.focus()
  }, [])

  function handleRemove(id) {
    removeFromFocusList(id)
    setList(getFocusList())
    setFocusedIndex(null)
    setRemoveButtonFocused(false)
    setConfirmRemove(null)
  }

  function handleClear() {
    setConfirmClear(true)
    setClearButtonFocused(false)
  }

  function executeClear() {
    clearFocusList()
    setList([])
    setFocusedIndex(null)
    setRemoveButtonFocused(false)
    setDrillButtonFocused(false)
    setClearButtonFocused(false)
    setHomeButtonFocused(false)
    setConfirmRemove(null)
    setConfirmClear(false)
  }

  function clearAllFocus() {
    setFocusedIndex(null)
    setRemoveButtonFocused(false)
    setDrillButtonFocused(false)
    setClearButtonFocused(false)
    setHomeButtonFocused(false)
  }

  useEffect(() => {
    function handleKeyDown(e) {

      if (document.body.classList.contains('nav-focused')) return

      if (confirmClear) {
        if (e.key === 'y' || e.key === 'Y') executeClear()
        if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') setConfirmClear(false)
        return
      }

      if (confirmRemove) {
        if (e.key === 'y' || e.key === 'Y') handleRemove(confirmRemove)
        if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') setConfirmRemove(null)
        return
      }

      if (e.key === 'Escape') {
        if (removeButtonFocused) { setRemoveButtonFocused(false); return }
        if (clearButtonFocused) { setClearButtonFocused(false); return }
        if (drillButtonFocused) { setDrillButtonFocused(false); return }
        if (homeButtonFocused) { setHomeButtonFocused(false); return }
        if (focusedIndex !== null) { setFocusedIndex(null); return }
        navigate('/')
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        document.body.classList.add('keyboard-nav-active')
        if (removeButtonFocused) { setRemoveButtonFocused(false); return }
        if (homeButtonFocused) return
        if (clearButtonFocused) { setClearButtonFocused(false); setHomeButtonFocused(true); return }
        if (drillButtonFocused) { setDrillButtonFocused(false); setHomeButtonFocused(true); return }
        if (isOnLastItem) { setDrillButtonFocused(true); return }
        setFocusedIndex(prev => prev === null ? 0 : Math.min(prev + 1, focusedCommands.length - 1))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        document.body.classList.add('keyboard-nav-active')
        if (removeButtonFocused) { setRemoveButtonFocused(false); return }
        if (homeButtonFocused) { setHomeButtonFocused(false); setDrillButtonFocused(true); return }
        if (clearButtonFocused) { setClearButtonFocused(false); setDrillButtonFocused(true); return }
        if (drillButtonFocused) { setDrillButtonFocused(false); return }
        setFocusedIndex(prev => prev === null ? 0 : Math.max(prev - 1, 0))
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (drillButtonFocused) { setDrillButtonFocused(false); setClearButtonFocused(true); return }
        if (focusedIndex !== null && !removeButtonFocused) { setRemoveButtonFocused(true); return }
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (removeButtonFocused) { setRemoveButtonFocused(false); return }
        if (clearButtonFocused) { setClearButtonFocused(false); setDrillButtonFocused(true); return }
      }

      if (e.key === 'Enter') {
        if (homeButtonFocused) { navigate('/'); return }
        if (clearButtonFocused) { handleClear(); return }
        if (drillButtonFocused) { navigate('/modes?category=focus'); return }
        if (removeButtonFocused && focusedIndex !== null) {
          setConfirmRemove(focusedCommands[focusedIndex].id)
          setRemoveButtonFocused(false)
          return
        }
      }

      if (e.key === 'Backspace' && focusedIndex !== null && !removeButtonFocused) {
        setConfirmRemove(focusedCommands[focusedIndex].id)
      }
    }

    let lastX = 0
    let lastY = 0
    function handleMouseMove(e) {
      const dx = Math.abs(e.clientX - lastX)
      const dy = Math.abs(e.clientY - lastY)
      lastX = e.clientX
      lastY = e.clientY
      if (dx > 5 || dy > 5) {
        document.body.classList.remove('keyboard-nav-active')
        clearAllFocus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.classList.remove('keyboard-nav-active')
    }
  }, [focusedIndex, focusedCommands, confirmRemove, confirmClear, removeButtonFocused, drillButtonFocused, clearButtonFocused, homeButtonFocused, isOnLastItem])

  const confirmCommand = confirmRemove ? commands.find(c => c.id === confirmRemove) : null

  return (
    <div
      className="focus-page"
      ref={containerRef}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <h1>Linux Command Trainer</h1>
      <p className="subtitle">Focus List — <span className="key-hint">↑↓ navigate · → remove · Esc back</span></p>

      {focusedCommands.length === 0 ? (
        <div className="focus-empty">
          <p>Your focus list is empty.</p>
          <p>Commands you find difficult can be added from the results screen after a drill.</p>
        </div>
      ) : (
        <>
          <div className="focus-list">
            {focusedCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                className={`focus-item ${focusedIndex === index && !drillButtonFocused && !clearButtonFocused && !homeButtonFocused ? 'keyboard-focused' : ''}`}
              >
                <div className="focus-item-info">
                  <span className="focus-cmd">{cmd.command}</span>
                  <span className="focus-desc">{cmd.short_desc}</span>
                  <span className="focus-category">{capitalise(cmd.category)}</span>
                </div>
                <button
                  className={`focus-remove-btn ${focusedIndex === index && removeButtonFocused ? 'keyboard-focused' : ''}`}
                  onClick={() => setConfirmRemove(cmd.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {confirmCommand && (
            <div className="focus-confirm">
              <p>Remove <span className="highlight">{confirmCommand.command}</span> from your focus list?</p>
              <div className="focus-confirm-actions">
                <button className="results-btn yes" onClick={() => handleRemove(confirmCommand.id)}>
                  Yes <span className="key-hint">Y</span>
                </button>
                <button className="results-btn no" onClick={() => setConfirmRemove(null)}>
                  No <span className="key-hint">N</span>
                </button>
              </div>
            </div>
          )}

          {confirmClear && (
            <div className="focus-confirm">
              <p>⚠️ This will clear your focus list. Are you sure?</p>
              <div className="focus-confirm-actions">
                <button className="results-btn yes" onClick={executeClear}>
                  Yes <span className="key-hint">Y</span>
                </button>
                <button className="results-btn no" onClick={() => setConfirmClear(false)}>
                  No <span className="key-hint">N</span>
                </button>
              </div>
            </div>
          )}

          <div className="focus-actions">
            <button
              className={`landing-cta ${drillButtonFocused ? 'keyboard-focused' : ''}`}
              onClick={() => navigate('/modes?category=focus')}
            >
              Drill focus list →
            </button>
            <button
              className={`focus-clear-btn ${clearButtonFocused ? 'keyboard-focused' : ''}`}
              onClick={handleClear}
            >
              Clear all
            </button>
          </div>
        </>
      )}

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

export default FocusList