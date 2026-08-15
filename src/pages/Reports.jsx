import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import useExpenseStore from '../stores/expenseStore'
import categories from '../data/categories'
import formatCurrency from '../utils/formatCurrency'
import formatDate from '../utils/formatDate'

const COLORS = ['#4f46e5', '#0ea5e9', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899']

function Reports() {
  const expenses = useExpenseStore((state) => state.expenses)
  const safeExpenses = useMemo(
    () => (Array.isArray(expenses) ? expenses.filter((exp) => exp && typeof exp === 'object') : []),
    [expenses],
  )

  const categoryData = useMemo(() => {
    const onlyExpenses = safeExpenses.filter((e) => e.type === 'expense')
    const total = onlyExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

    return categories
      .map((cat) => {
        const value = onlyExpenses
          .filter((e) => e.categoryId === cat.id)
          .reduce((sum, e) => sum + (Number(e.amount) || 0), 0)

        return { name: cat.label, value, percent: total ? Math.round((value / total) * 100) : 0 }
      })
      .filter((item) => Number(item.value) > 0)
      .sort((a, b) => b.value - a.value)
  }, [safeExpenses])

  const averageSpendPerCategory = useMemo(() => {
    if (categoryData.length === 0) return 0
    const total = categoryData.reduce((sum, item) => sum + item.value, 0)
    return total / categoryData.length
  }, [categoryData])

  const monthlyData = useMemo(() => {
    const totals = {}

    safeExpenses.forEach((exp) => {
      if (!exp.date || typeof exp.date !== 'string') return

      const key = exp.date.slice(0, 7)
      if (!/^\d{4}-\d{2}$/.test(key)) return

      const amount = Number(exp.amount)
      if (!Number.isFinite(amount)) return

      if (!totals[key]) {
        totals[key] = {
          key,
          label: formatDate(`${key}-01`, 'MMM yyyy'),
          income: 0,
          expense: 0,
        }
      }

      if (exp.type === 'income') totals[key].income += amount
      else if (exp.type === 'expense') totals[key].expense += amount
    })

    return Object.values(totals).sort((a, b) => a.key.localeCompare(b.key))
  }, [safeExpenses])

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Where your money is going, and how it changes over time.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-3" aria-label="Expenses by category chart" role="img">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Expenses by Category</h2>
          {categoryData.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">No expense data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${percent}%`}
                >
                  {categoryData.map((item, index) => (
                    <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Breakdown</h2>
          {categoryData.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing to show yet.</p>
          ) : (
            <ul className="space-y-3">
              {categoryData.map((item, index) => (
                <li key={item.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    {item.name}
                  </span>
                  <span className="text-slate-500">{item.percent}%</span>
                  <span className="font-medium text-slate-900">{formatCurrency(item.value)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5" aria-label="Monthly income and expense chart" role="img">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Income vs Expenses by Month</h2>
        {monthlyData.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">Average Spend per Category</h2>
        <p className="text-2xl font-semibold text-slate-900">{formatCurrency(averageSpendPerCategory)}</p>
        <p className="mt-1 text-sm text-slate-500">Average monthly value across the categories currently in your expense data.</p>
      </div>
    </section>
  )
}

export default Reports