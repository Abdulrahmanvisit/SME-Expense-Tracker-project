import { create } from 'zustand'

const useExpenseStore = create((set) => ({
  expenses: JSON.parse(localStorage.getItem('expenses')) || [],

  addExpense: (expense) =>
    set((state) => {
      const updated = [...state.expenses, expense]
      localStorage.setItem('expenses', JSON.stringify(updated))
      return { expenses: updated }
    }),

  deleteExpense: (id) =>
    set((state) => {
      const updated = state.expenses.filter((exp) => exp.id !== id)
      localStorage.setItem('expenses', JSON.stringify(updated))
      return { expenses: updated }
    }),

  updateExpense: (id, updatedFields) =>
    set((state) => {
      const updated = state.expenses.map((exp) =>
        exp.id === id ? { ...exp, ...updatedFields } : exp
      )
      localStorage.setItem('expenses', JSON.stringify(updated))
      return { expenses: updated }
    }),
}))

export default useExpenseStore