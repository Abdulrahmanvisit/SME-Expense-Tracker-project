import { create } from 'zustand'
import { getExpenses, saveExpenses } from '../services/expenseService'

const useExpenseStore = create((set, get) => ({
  expenses: getExpenses(),

  addExpense: (expense) =>
    set((state) => {
      const updated = [...state.expenses, expense]
      saveExpenses(updated)
      return { expenses: updated }
    }),

  deleteExpense: (id) =>
    set((state) => {
      const updated = state.expenses.filter((exp) => exp.id !== id)
      saveExpenses(updated)
      return { expenses: updated }
    }),

  updateExpense: (id, updatedFields) =>
    set((state) => {
      const updated = state.expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updatedFields } : exp
      )
      saveExpenses(updated)
      return { expenses: updated }
    }),

  getTotalIncome: () => get().expenses.filter((e) => e.type === 'income').reduce((sum, e) => sum + e.amount, 0),
  getTotalExpense: () => get().expenses.filter((e) => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0),
  getBalance: () => get().getTotalIncome() - get().getTotalExpense(),
}))

export default useExpenseStore