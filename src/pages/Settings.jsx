import { useRef, useState } from 'react'
import useExpenseStore from '../stores/expenseStore'

function isValidImportedExpense(value) {
  if (!value || typeof value !== 'object') return false
  if (typeof value.id !== 'string' && typeof value.id !== 'number') return false
  if (!['income', 'expense'].includes(value.type)) return false
  if (typeof value.categoryId !== 'string' || value.categoryId.trim() === '') return false
  if (typeof value.date !== 'string' || !value.date) return false
  if (typeof value.description !== 'string') return false

  const amount = Number(value.amount)
  return Number.isFinite(amount) && amount >= 0
}

function Settings() {
  const expenses = useExpenseStore((state) => state.expenses)
  const clearExpenses = useExpenseStore((state) => state.clearExpenses)
  const replaceExpenses = useExpenseStore((state) => state.replaceExpenses)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importMessage, setImportMessage] = useState('')
  const fileInputRef = useRef(null)

  const handleExport = () => {
    if (expenses.length === 0) {
      setImportMessage('No expense data is available to export yet.')
      return
    }

    const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ledgerline-expenses.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleClearAll = () => {
    clearExpenses()
    setConfirmClear(false)
    setImportMessage('All expense data has been cleared.')
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)

      if (!Array.isArray(parsed) || !parsed.every(isValidImportedExpense)) {
        setImportMessage('Invalid import file. Expected an array of expense entries with id, type, amount, categoryId, description, and date.')
        event.target.value = ''
        return
      }

      const normalized = parsed.map((entry) => ({
        ...entry,
        amount: Number(entry.amount),
        description: typeof entry.description === 'string' ? entry.description : '',
      }))

      replaceExpenses(normalized)
      setImportMessage(`Imported ${normalized.length} entries successfully.`)
    } catch {
      setImportMessage('Import failed: please choose a valid JSON file exported from this app.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your data stored on this device.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Export Data</h2>
        <p className="mt-1 text-sm text-slate-500">
          Download all {expenses.length} recorded entries as a JSON file, useful as a backup or before clearing your data.
        </p>
        <button
          type="button"
          onClick={handleExport}
          disabled={expenses.length === 0}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Export as JSON
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Import Data</h2>
        <p className="mt-1 text-sm text-slate-500">Restore a previously exported JSON backup into the app.</p>

        <input
          ref={fileInputRef}
          id="import-expenses-json"
          type="file"
          accept="application/json"
          aria-label="Import expenses JSON"
          onChange={handleImport}
          className="hidden"
        />

        <label
          htmlFor="import-expenses-json"
          className="mt-4 inline-flex cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Import JSON
        </label>

        {importMessage ? <p className="mt-3 text-sm text-slate-600">{importMessage}</p> : null}
      </div>

      <div className="rounded-lg border border-red-200 bg-red-50 p-5">
        <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-600">
          This permanently deletes every income and expense entry stored on this device. This cannot be undone.
        </p>

        {!confirmClear ? (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            className="mt-4 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            Clear All Data
          </button>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <p className="text-sm font-medium text-red-700">Are you sure? This cannot be undone.</p>
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Yes, delete everything
            </button>
            <button
              type="button"
              onClick={() => setConfirmClear(false)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Settings