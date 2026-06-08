const FOCUS_KEY = 'linux_trainer_focus_list'

export function getFocusList() {
  try {
    return JSON.parse(localStorage.getItem(FOCUS_KEY)) || []
  } catch {
    return []
  }
}

export function addToFocusList(commandIds) {
  const current = getFocusList()
  const updated = [...new Set([...current, ...commandIds])]
  localStorage.setItem(FOCUS_KEY, JSON.stringify(updated))
}

export function removeFromFocusList(commandId) {
  const current = getFocusList()
  const updated = current.filter(id => id !== commandId)
  localStorage.setItem(FOCUS_KEY, JSON.stringify(updated))
}

export function clearFocusList() {
  localStorage.setItem(FOCUS_KEY, JSON.stringify([]))
}

export function isInFocusList(commandId) {
  return getFocusList().includes(commandId)
}