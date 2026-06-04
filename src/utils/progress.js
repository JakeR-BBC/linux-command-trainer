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
    progress[commandId] = { correct: 0, retired: [] }
  }
  progress[commandId].correct += 1
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  return progress[commandId].correct
}

export function retireCommand(commandId, category) {
  const progress = getProgress()
  if (!progress[commandId]) {
    progress[commandId] = { correct: 0, retired: [] }
  }
  if (!progress[commandId].retired.includes(category)) {
    progress[commandId].retired.push(category)
  }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function restoreCategory(category, commands) {
  const progress = getProgress()
  commands.forEach(cmd => {
    if (progress[cmd.id]) {
      progress[cmd.id].retired = progress[cmd.id].retired.filter(c => c !== category)
      progress[cmd.id].correct = 0
    }
  })
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

export function isRetired(commandId, category) {
  const progress = getProgress()
  return progress[commandId]?.retired?.includes(category) || false
}

export function getCorrectCount(commandId) {
  const progress = getProgress()
  return progress[commandId]?.correct || 0
}

export function getRetiredCount(category, commands) {
  return commands.filter(cmd => isRetired(cmd.id, category)).length
}