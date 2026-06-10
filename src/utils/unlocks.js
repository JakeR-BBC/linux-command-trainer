import { getBestResult } from './results'

const MODES = ['recognition', 'recall', 'scenario', 'realism', 'mastery']
const UNLOCK_THRESHOLD = 80

export function getModeIndex(mode) {
  return MODES.indexOf(mode)
}

export function isModeUnlocked(mode, category, commands) {
  if (mode === 'recognition') return true
  const modeIndex = getModeIndex(mode)
  const previousMode = MODES[modeIndex - 1]
  const categoryResult = getBestResult(previousMode, category)
  if (categoryResult && categoryResult.accuracy >= UNLOCK_THRESHOLD) return true
  return false
}

export function isAllUnlocked(mode, commands) {
  const categories = [...new Set(commands.map(c => c.category))]
  return categories.every(category => {
    const result = getBestResult(mode, category)
    return result && result.accuracy >= UNLOCK_THRESHOLD
  })
}

export function getUnlockProgress(mode, category) {
  const modeIndex = getModeIndex(mode)
  if (modeIndex === 0) return null
  const previousMode = MODES[modeIndex - 1]
  const result = getBestResult(previousMode, category)
  if (!result) return { score: 0, required: UNLOCK_THRESHOLD }
  return { score: result.accuracy, required: UNLOCK_THRESHOLD }
}