import { useMemo, useState } from 'react'
import { isValid, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subWeeks, subMonths, subYears } from 'date-fns'
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi'
import useExpenseStore from '../stores/expenseStore'
import formatCurrency from '../utils/formatCurrency'
import formatDate from '../utils/formatDate'
import getCategoryLabel from '../utils/getCategoryLabel'

const RANGE_OPTIONS = [
  { value: 'all', label: 'All time' },
  { value: 'week', label: 'This week' },
  { value: 'month', label: 'This month' },
  { value: 'year', label: 'This year' },
]

function getRangeWindow(range) {
  const now = new Date()

  switch (range) {
    case 'week':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      }
    case 'month':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      }
    case 'year':
      return {
        start: startOfYear(now),
        end: endOfYear(now),
      }
    default:
      return null
  }
}

function getPreviousRangeWindow(range) {
  const now = new Date()

  switch (range) {
    case 'week':
      return {
        start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
        end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      }
    case 'month':
      return {
        start: startOfMonth(subMonths(now, 1)),
        end: endOfMonth(subMonths(now, 1)),
      }
    case 'year':
      return {
        start: startOfYear(subYears(now, 1)),
        end: endOfYear(subYears(now, 1)),
      }
    default:
      return null
  }
}

function matchesRange(expense, range) {
  if (!expense?.date || typeof expense.date !== 'string') return false

  const parsedDate = parseISO(expense.date)
  if (!isValid(parsedDate)) return false

  const rangeWindow = getRangeWindow(range)
  if (!rangeWindow) return true

  const start = rangeWindow.start
  const end = rangeWindow.end

  return parsedDate >= start && parsedDate <= end
}

function calculatePercentChange(currentValue, previousValue) {
  if (previousValue === 0) {
    if (currentValue === 0) return 0
    return 100
  }

  return ((currentValue - previousValue) / previousValue) * 100
}

function StatCard({ icon: Icon, label, value, tone, trendValue, trendDirection }) {
  const toneStyles = {
    emerald: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  }

  const trendStyles = {
    up: 'bg-emerald-50 text-emerald-600',
    down: 'bg-red-50 text-red-600',
  }

  const TrendIcon = trendDirection === 'up' ? FiArrowUpRight : FiArrowDownRight

  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${toneStyles[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">{formatCurrency(value)}</p>

        <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trendStyles[trendDirection]}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          <span>{Math.abs(trendValue).toFixed(1)}% vs prev</span>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const expenses = useExpenseStore((state) => state.expenses)
  const [selectedRange, setSelectedRange] = useState('all')

  const filteredExpenses = useMemo(() => {
    return [...expenses]
      .filter((exp) => matchesRange(exp, selectedRange))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [expenses, selectedRange])

  const currentIncome = useMemo(
    () => filteredExpenses.filter((exp) => exp.type === 'income').reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0),
    [filteredExpenses],
  )

  const currentExpense = useMemo(
    () => filteredExpenses.filter((exp) => exp.type === 'expense').reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0),
    [filteredExpenses],
  )

  const previousWindow = selectedRange === 'all' ? null : getPreviousRangeWindow(selectedRange)

  const previousExpenses = useMemo(() => {
    if (!previousWindow) return []

    return [...expenses].filter((exp) => {
      if (!exp?.date || typeof exp.date !== 'string') return false

      const parsedDate = parseISO(exp.date)
      if (!isValid(parsedDate)) return false

      return parsedDate >= previousWindow.start && parsedDate <= previousWindow.end
    })
  }, [expenses, previousWindow])

  const previousIncome = useMemo(
    () => previousExpenses.filter((exp) => exp.type === 'income').reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0),
    [previousExpenses],
  )

  const previousExpense = useMemo(
    () => previousExpenses.filter((exp) => exp.type === 'expense').reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0),
    [previousExpenses],
  )

  const effectivePreviousIncome = selectedRange === 'all' ? currentIncome : previousIncome
  const effectivePreviousExpense = selectedRange === 'all' ? currentExpense : previousExpense

  const incomeTrend = selectedRange === 'all' ? 0 : calculatePercentChange(currentIncome, effectivePreviousIncome)
  const expenseTrend = selectedRange === 'all' ? 0 : calculatePercentChange(currentExpense, effectivePreviousExpense)
  const balanceTrend = selectedRange === 'all' ? 0 : ((currentIncome - currentExpense) / Math.max(currentIncome, 1)) * 100 || 0

  const totalIncome = useExpenseStore((state) => state.getTotalIncome())
  const totalExpense = useExpenseStore((state) => state.getTotalExpense())
  const balance = useExpenseStore((state) => state.getBalance())

  const recentActivity = useMemo(
    () => [...filteredExpenses].slice(0, 6),
    [filteredExpenses],
  )

  const currentPeriodLabel = RANGE_OPTIONS.find((item) => item.value === selectedRange)?.label ?? 'All time'

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">An overview of your business finances.</p>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-label={`Filter dashboard to ${option.label}`}
              onClick={() => setSelectedRange(option.value)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                selectedRange === option.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={FiTrendingUp}
          label="Total Income"
          value={selectedRange === 'all' ? totalIncome : currentIncome}
          tone="emerald"
          trendValue={incomeTrend}
          trendDirection={incomeTrend >= 0 ? 'up' : 'down'}
        />
        <StatCard
          icon={FiTrendingDown}
          label="Total Expenses"
          value={selectedRange === 'all' ? totalExpense : currentExpense}
          tone="red"
          trendValue={expenseTrend}
          trendDirection={expenseTrend <= 0 ? 'up' : 'down'}
        />
        <StatCard
          icon={FiDollarSign}
          label="Remaining Balance"
          value={balance}
          tone={balance >= 0 ? 'indigo' : 'red'}
          trendValue={balanceTrend}
          trendDirection={(currentIncome - currentExpense) >= 0 ? 'up' : 'down'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
            <span className="text-xs font-medium text-slate-500">{currentPeriodLabel}</span>
          </div>

          {recentActivity.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No entries in the selected period yet.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((exp) => {
                const description = typeof exp.description === 'string' && exp.description.trim() ? exp.description : 'No description'
                const isIncome = exp.type === 'income'

                return (
                  <div
                    key={exp.id}
                    className={`flex items-start gap-3 rounded-lg border border-slate-200 p-3 ${
                      isIncome ? 'border-l-4 border-l-emerald-500 bg-emerald-50/40' : 'border-l-4 border-l-red-500 bg-red-50/40'
                    }`}
                  >
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium text-slate-900">{description}</p>
                        <p className={`text-sm font-semibold ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                          {formatCurrency(exp.amount)}
                        </p>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{getCategoryLabel(exp.categoryId)}</span>
                        <span>•</span>
                        <span>{formatDate(exp.date)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Snapshot</h2>
          <div className="space-y-4">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current period</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{currentPeriodLabel}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Income</p>
              <p className="mt-2 text-lg font-semibold text-emerald-600">{formatCurrency(selectedRange === 'all' ? totalIncome : currentIncome)}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Expenses</p>
              <p className="mt-2 text-lg font-semibold text-red-600">{formatCurrency(selectedRange === 'all' ? totalExpense : currentExpense)}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Balance</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(balance)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard