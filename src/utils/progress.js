const PROGRESS_KEY = 'linux_trainer_progress'

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}
  } catch {
    return {}
  }
}

export function incrementCorrect(commandId) {
  const progress = getProgress()
  if (!progress[commandId]) {
    progress[commandId] = { correct: 0 }
  }
  progress[commandId].correct += 1
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  return progress[commandId].correct
}

export function getCorrectCount(commandId) {
  const progress = getProgress()
  return progress[commandId]?.correct || 0
}