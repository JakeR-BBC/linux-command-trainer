const RESULTS_KEY = 'linux_trainer_results'

export function getResults() {
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY)) || {}
  } catch {
    return {}
  }
}

export function saveResult(mode, category, result) {
  const results = getResults()
  const key = `${mode}__${category}`
  const existing = results[key]

  if (!existing || result.accuracy > existing.accuracy) {
    results[key] = {
      mode,
      category,
      correct: result.correct,
      incorrect: result.incorrect,
      skipped: result.skipped,
      accuracy: result.accuracy,
      date: new Date().toISOString()
    }
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results))
    return true
  }
  return false
}

export function getBestResult(mode, category) {
  const results = getResults()
  return results[`${mode}__${category}`] || null
}