import { useEffect, useRef } from 'react'

function MacBadge({ command, show, onDismiss }) {
  const listenersRef = useRef(null)

  useEffect(() => {
    console.log('MacBadge effect fired, show:', show)
    if (!show) return

    const timer = setTimeout(() => {
      console.log('Adding listeners')
      function dismiss(e) {
        console.log('Dismiss fired by:', e.type)
        onDismiss()
      }

      window.addEventListener('keydown', dismiss)
      window.addEventListener('mousedown', dismiss)
      listenersRef.current = dismiss
    }, 300)

    return () => {
      console.log('Cleanup fired')
      clearTimeout(timer)
      if (listenersRef.current) {
        window.removeEventListener('keydown', listenersRef.current)
        window.removeEventListener('mousedown', listenersRef.current)
        listenersRef.current = null
      }
    }
  }, [show])

  if (!show || command.mac_compatible) return null

  return (
    <div className="mac-popup">
      <p>⚠️ This command isn't natively available on macOS.</p>
      {command.mac_equivalent && (
        <p>Mac equivalent: <span className="highlight">{command.mac_equivalent}</span></p>
      )}
    </div>
  )
}

export default MacBadge