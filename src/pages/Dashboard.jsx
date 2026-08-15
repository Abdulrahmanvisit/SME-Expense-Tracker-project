import { useMemo } from 'react'
import useExpenseStore from '../stores/expenseStore'
import categories from '../data/categories'

function Dashboard() {
  const expenses = useExpenseStore((state) => state.expenses)
  const totalIncome = useExpenseStore((state) => state.getTotalIncome())
  const totalExpense = useExpenseStore((state) => state.getTotalExpense())
  const balance = useExpenseStore((state) => state.getBalance())

  const recentExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  }, [expenses])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Income</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">₦{totalIncome.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Expenses</p>
          <p className="mt-2 text-2xl font-semibold text-red-600">₦{totalExpense.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Remaining Balance</p>
          <p className={`mt-2 text-2xl font-semibold ${balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
            ₦{balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Transactions</h2>
        {recentExpenses.length === 0 ? (
          <p className="text-sm text-slate-500">No entries recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {recentExpenses.map((exp) => (
              <li key={exp.id} className="flex justify-between text-sm text-slate-700">
                <span>{exp.description || 'No description'}</span>
                <span className="text-slate-500">
                  {categories.find((c) => c.id === exp.categoryId)?.label} · {exp.date}
                </span>
                <span className={exp.type === 'income' ? 'font-medium text-emerald-600' : 'font-medium text-red-600'}>
                  {exp.type === 'income' ? '+' : '-'}₦{exp.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default Dashboard