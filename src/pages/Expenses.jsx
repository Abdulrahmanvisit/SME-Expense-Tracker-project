import { useReducer, useState, useMemo } from 'react'
import { parseISO, isValid } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import categories from '../data/categories'
import useExpenseStore from '../stores/expenseStore'
import formatCurrency from '../utils/formatCurrency'
import formatDate from '../utils/formatDate'
import getCategoryLabel from '../utils/getCategoryLabel'

const initialForm = { type: 'expense', amount: '', categoryId: '', description: '', date: '' }

function safeText(value) {
  return typeof value === 'string' ? value : ''
}

function safeNumber(value) {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}

function validateDateInput(dateString) {
  if (!dateString) return 'Date is required.'

  const match = /^\d{4}-\d{2}-\d{2}$/.exec(dateString)
  if (!match) return 'Please choose a valid date.'

  const year = Number(match[0].slice(0, 4))
  if (year < 2000 || year > 2100) return 'Year must be between 2000 and 2100.'

  const parsedDate = parseISO(dateString)
  if (!isValid(parsedDate)) return 'Please choose a valid date.'

  return ''
}

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'LOAD':
      return {
        type: action.payload.type,
        amount: action.payload.amount,
        categoryId: action.payload.categoryId,
        description: action.payload.description,
        date: action.payload.date,
      }
    case 'RESET':
      return initialForm
    default:
      return state
  }
}

function Expenses() {
  const [form, dispatch] = useReducer(formReducer, initialForm)
  const [editingId, setEditingId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [dateError, setDateError] = useState('')

  const addExpense = useExpenseStore((state) => state.addExpense)
  const deleteExpense = useExpenseStore((state) => state.deleteExpense)
  const updateExpense = useExpenseStore((state) => state.updateExpense)
  const expenses = useExpenseStore((state) => state.expenses)

  const filteredExpenses = useMemo(() => {
    const normalizedSearch = safeText(searchTerm).trim().toLowerCase()

    return expenses.filter((exp) => {
      const description = safeText(exp?.description)
      const categoryName = safeText(getCategoryLabel(exp?.categoryId))

      const matchesSearch =
        description.toLowerCase().includes(normalizedSearch) ||
        categoryName.toLowerCase().includes(normalizedSearch)

      const matchesCategory = filterCategory ? exp?.categoryId === filterCategory : true
      const matchesDate = filterDate ? safeText(exp?.date) === filterDate : true

      return matchesSearch && matchesCategory && matchesDate
    })
  }, [expenses, searchTerm, filterCategory, filterDate])

  const handleChange = (event) => {
    const { name, value } = event.target
    dispatch({ type: 'SET_FIELD', field: name, value })

    if (name === 'date') {
      setDateError(validateDateInput(value))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextDateError = validateDateInput(form.date)
    setDateError(nextDateError)

    const amountValue = safeNumber(form.amount)
    if (nextDateError || !amountValue || !form.categoryId || !form.date) return

    const nextExpense = {
      ...form,
      amount: amountValue,
      description: safeText(form.description),
    }

    if (editingId) {
      updateExpense(editingId, nextExpense)
      setEditingId(null)
    } else {
      addExpense({ id: uuidv4(), ...nextExpense })
    }

    dispatch({ type: 'RESET' })
    setDateError('')
  }

  const startEdit = (exp) => {
    setEditingId(exp.id)
    setDateError('')
    dispatch({ type: 'LOAD', payload: exp })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterCategory('')
    setFilterDate('')
  }

  const amountPreview = form.amount === '' ? '₦0' : formatCurrency(form.amount)
  const isSubmitDisabled = Boolean(dateError) || !form.amount || !form.categoryId || !form.date

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Expenses</h1>

      <form onSubmit={handleSubmit} className="grid w-full gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <select name="type" value={form.type} onChange={handleChange} className="min-w-0 rounded-md border border-slate-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <div className="sm:col-span-1">
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            aria-label="Expense amount"
            className="w-full min-w-0 rounded-md border border-slate-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="mt-2 text-xs font-medium text-slate-500">Preview: {amountPreview}</p>
        </div>

        <select name="categoryId" value={form.categoryId} onChange={handleChange} className="min-w-0 rounded-md border border-slate-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>

        <div className="sm:col-span-1">
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            aria-label="Expense date"
            className="w-full min-w-0 rounded-md border border-slate-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {dateError ? <p className="mt-2 text-xs font-medium text-red-600">{dateError}</p> : null}
        </div>

        <input
          name="description"
          type="text"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          aria-label="Expense description"
          className="min-w-0 rounded-md border border-slate-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"
        />

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="sm:col-span-2 rounded-md bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {editingId ? 'Update Entry' : 'Add Entry'}
        </button>
      </form>

      <div className="grid w-full gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name or category"
          aria-label="Search expenses"
          className="min-w-0 rounded-md border border-slate-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"
        />
        <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} className="min-w-0 rounded-md border border-slate-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <input type="date" value={filterDate} onChange={(event) => setFilterDate(event.target.value)} className="min-w-0 rounded-md border border-slate-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        {(searchTerm || filterCategory || filterDate) && (
          <button type="button" onClick={clearFilters} className="sm:col-span-4 text-left text-sm text-indigo-600 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {filteredExpenses.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-500">No entries match your search or filters.</p>
        )}
        {filteredExpenses.map((exp) => (
          <li key={String(exp.id)} className="flex w-full flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className={`order-2 w-full text-slate-600 ${exp.type === 'income' ? 'text-emerald-600' : 'text-slate-700'} sm:order-1 sm:w-auto`}>
              {exp.type === 'income' ? '+' : '-'}{formatCurrency(exp.amount)}
            </span>
            <div className="min-w-0 flex-1 sm:order-2">
              <p className="truncate text-sm font-medium text-slate-900">{safeText(exp.description) || 'No description'}</p>
              <p className="mt-1 text-xs text-slate-500">{getCategoryLabel(exp.categoryId)} · {formatDate(exp.date)}</p>
            </div>
            <div className="order-3 flex gap-2">
              <button type="button" onClick={() => startEdit(exp)} className="text-indigo-600 hover:underline">Edit</button>
              <button type="button" onClick={() => deleteExpense(exp.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Expenses