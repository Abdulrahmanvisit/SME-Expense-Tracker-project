import { useReducer, useState, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import categories from '../data/categories'
import useExpenseStore from '../stores/expenseStore'

const initialForm = { type: 'expense', amount: '', categoryId: '', description: '', date: '' }

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

  const addExpense = useExpenseStore((state) => state.addExpense)
  const deleteExpense = useExpenseStore((state) => state.deleteExpense)
  const updateExpense = useExpenseStore((state) => state.updateExpense)
  const expenses = useExpenseStore((state) => state.expenses)

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        categories.find((c) => c.id === exp.categoryId)?.label.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = filterCategory ? exp.categoryId === filterCategory : true
      const matchesDate = filterDate ? exp.date === filterDate : true

      return matchesSearch && matchesCategory && matchesDate
    })
  }, [expenses, searchTerm, filterCategory, filterDate])

  const handleChange = (e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || !form.categoryId || !form.date) return

    if (editingId) {
      updateExpense(editingId, { ...form, amount: Number(form.amount) })
      setEditingId(null)
    } else {
      addExpense({ id: uuidv4(), ...form, amount: Number(form.amount) })
    }
    dispatch({ type: 'RESET' })
  }

  const startEdit = (exp) => {
    setEditingId(exp.id)
    dispatch({ type: 'LOAD', payload: exp })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterCategory('')
    setFilterDate('')
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Expenses</h1>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <select name="categoryId" value={form.categoryId} onChange={handleChange} className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <input name="date" type="date" value={form.date} onChange={handleChange} className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        <input name="description" type="text" value={form.description} onChange={handleChange} placeholder="Description" className="rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2" />
        <button type="submit" className="sm:col-span-2 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
          {editingId ? 'Update Entry' : 'Add Entry'}
        </button>
      </form>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or category"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:col-span-2"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {(searchTerm || filterCategory || filterDate) && (
          <button onClick={clearFilters} className="sm:col-span-4 text-left text-sm text-indigo-600 hover:underline">
            Clear filters
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {filteredExpenses.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-500">No entries match your search or filters.</p>
        )}
        {filteredExpenses.map((exp) => (
          <li key={exp.id} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className={exp.type === 'income' ? 'text-emerald-600' : 'text-slate-700'}>
              {exp.type === 'income' ? '+' : '-'}₦{exp.amount}
            </span>
            <span className="text-slate-600">{exp.description || 'No description'}</span>
            <span className="text-slate-500">{categories.find((c) => c.id === exp.categoryId)?.label} · {exp.date}</span>
            <span className="flex gap-2">
              <button onClick={() => startEdit(exp)} className="text-indigo-600 hover:underline">Edit</button>
              <button onClick={() => deleteExpense(exp.id)} className="text-red-600 hover:underline">Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Expenses