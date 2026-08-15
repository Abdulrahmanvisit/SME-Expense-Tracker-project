import { useMemo } from 'react'
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi'
import useExpenseStore from '../stores/expenseStore'
import categories from '../data/categories'
import formatCurrency from '../utils/formatCurrency'
import formatDate from '../utils/formatDate'
import getCategoryLabel from '../utils/getCategoryLabel'

function StatCard({ icon: Icon, label, value, tone }) {
  const toneStyles = {
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${toneStyles[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">₦{value.toLocaleString()}</p>
      </div>
    </div>
  )
}

function Dashboard() {
  const expenses = useExpenseStore((state) => state.expenses)
  const totalIncome = useExpenseStore((state) => state.getTotalIncome())
  const totalExpense = useExpenseStore((state) => state.getTotalExpense())
  const balance = useExpenseStore((state) => state.getBalance())

  const recentExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
  }, [expenses])

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">An overview of your business finances.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FiTrendingUp} label="Total Income" value={totalIncome} tone="emerald" />
        <StatCard icon={FiTrendingDown} label="Total Expenses" value={totalExpense} tone="red" />
        <StatCard icon={FiDollarSign} label="Remaining Balance" value={balance} tone={balance >= 0 ? 'indigo' : 'red'} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Transactions</h2>
        {recentExpenses.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No entries recorded yet. Add your first transaction on the Expenses page.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentExpenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{exp.description || 'No description'}</p>
                  <p className="text-xs text-slate-500">
                    {categories.find((c) => c.id === exp.categoryId)?.label} · {exp.date}
                  </p>
                </div>
                <p className={`text-sm font-semibold ${exp.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {exp.type === 'income' ? '+' : '-'}₦{exp.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Dashboard