import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import useExpenseStore from '../stores/expenseStore'
import categories from '../data/categories'

const COLORS = ['#4f46e5', '#0ea5e9', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899']

function Reports() {
  const expenses = useExpenseStore((state) => state.expenses)

  const categoryData = useMemo(() => {
    const onlyExpenses = expenses.filter((e) => e.type === 'expense')
    return categories
      .map((cat) => ({
        name: cat.label,
        value: onlyExpenses.filter((e) => e.categoryId === cat.id).reduce((sum, e) => sum + e.amount, 0),
      }))
      .filter((item) => item.value > 0)
  }, [expenses])

  const monthlyData = useMemo(() => {
    const totals = {}
    expenses.forEach((exp) => {
      const month = exp.date?.slice(0, 7)
      if (!month) return
      if (!totals[month]) totals[month] = { month, income: 0, expense: 0 }
      totals[month][exp.type] += exp.amount
    })
    return Object.values(totals).sort((a, b) => a.month.localeCompare(b.month))
  }, [expenses])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Reports</h1>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Expenses by Category</h2>
        {categoryData.length === 0 ? (
          <p className="text-sm text-slate-500">No expense data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Income vs Expenses by Month</h2>
        {monthlyData.length === 0 ? (
          <p className="text-sm text-slate-500">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}

export default Reports