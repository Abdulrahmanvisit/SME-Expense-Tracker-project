import { useState } from 'react'
import useExpenseStore from '../stores/expenseStore'

function Settings() {
  const expenses = useExpenseStore((state) => state.expenses)
  const [confirmClear, setConfirmClear] = useState(false)

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ledgerline-expenses.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleClearAll = () => {
    localStorage.removeItem('expenses')
    window.location.reload()
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
          onClick={handleExport}
          disabled={expenses.length === 0}
          className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Export as JSON
        </button>
      </div>

      <div className="rounded-lg border border-red-200 bg-red-50 p-5">
        <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-600">
          This permanently deletes every income and expense entry stored on this device. This cannot be undone.
        </p>

        {!confirmClear ? (
          <button
            onClick={() => setConfirmClear(true)}
            className="mt-4 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            Clear All Data
          </button>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <p className="text-sm font-medium text-red-700">Are you sure? This cannot be undone.</p>
            <button
              onClick={handleClearAll}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Yes, delete everything
            </button>
            <button
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