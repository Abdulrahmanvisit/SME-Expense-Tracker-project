const STORAGE_KEY = 'expenses'

function getExpenses() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

export { getExpenses, saveExpenses }