const STORAGE_KEY = "expenses";

function normalizeExpenses(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === "object");
}

function getExpenses() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return normalizeExpenses(parsed);
  } catch {
    return [];
  }
}

function saveExpenses(expenses) {
  try {
    const normalized = normalizeExpenses(expenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    return [];
  }
}

function clearExpenses() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch {
    return [];
  }
}

export { getExpenses, saveExpenses, clearExpenses };
