import { useMemo } from 'react'
import useExpenseStore from '../stores/expenseStore'
import categories from '../data/categories'

function Dashboard() {
  const expenses = useExpenseStore((state) => state.expenses)

  const { totalExpenses, recentExpenses } = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const recent = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)

    return { totalExpenses: total, recentExpenses: recent }
  }, [expenses])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">₦{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Number of Entries</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{expenses.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Categories in Use</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {new Set(expenses.map((exp) => exp.categoryId)).size}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Transactions</h2>
        {recentExpenses.length === 0 ? (
          <p className="text-sm text-slate-500">No expenses recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentExpenses.map((exp) => (
              <li key={exp.id} className="flex justify-between text-sm text-slate-700">
                <span>{exp.description || 'No description'}</span>
                <span className="text-slate-500">
                  {categories.find((c) => c.id === exp.categoryId)?.label} · {exp.date}
                </span>
                <span className="font-medium text-slate-900">₦{exp.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default Dashboard