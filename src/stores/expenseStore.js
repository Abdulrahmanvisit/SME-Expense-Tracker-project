import { create } from "zustand";
import {
  getExpenses,
  saveExpenses,
  clearExpenses,
} from "../services/expenseService";

function isValidExpense(expense) {
  if (!expense || typeof expense !== "object") return false;
  if (!expense.id && expense.id !== 0) return false;
  if (!["income", "expense"].includes(expense.type)) return false;

  const amount = Number(expense.amount);
  if (!Number.isFinite(amount) || amount < 0) return false;

  return typeof expense.date === "string" && expense.date.length > 0;
}

function sanitizeExpenseList(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => isValidExpense(item));
}

const useExpenseStore = create((set, get) => ({
  expenses: sanitizeExpenseList(getExpenses()),

  addExpense: (expense) =>
    set((state) => {
      if (!isValidExpense(expense)) return state;

      const updated = [...sanitizeExpenseList(state.expenses), expense];
      saveExpenses(updated);
      return { expenses: updated };
    }),

  deleteExpense: (id) =>
    set((state) => {
      const updated = sanitizeExpenseList(state.expenses).filter(
        (exp) => String(exp.id) !== String(id),
      );
      saveExpenses(updated);
      return { expenses: updated };
    }),

  updateExpense: (id, updatedFields) =>
    set((state) => {
      const updated = sanitizeExpenseList(state.expenses).map((exp) => {
        if (String(exp.id) !== String(id)) return exp;

        const next = { ...exp, ...updatedFields };
        return isValidExpense(next) ? next : exp;
      });

      saveExpenses(updated);
      return { expenses: updated };
    }),

  replaceExpenses: (expenses) =>
    set(() => {
      const sanitized = sanitizeExpenseList(expenses);
      saveExpenses(sanitized);
      return { expenses: sanitized };
    }),

  clearExpenses: () =>
    set(() => {
      const updated = clearExpenses();
      return { expenses: updated };
    }),

  getTotalIncome: () =>
    get()
      .expenses.filter((e) => e.type === "income")
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0),

  getTotalExpense: () =>
    get()
      .expenses.filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0),

  getBalance: () => get().getTotalIncome() - get().getTotalExpense(),
}));

export default useExpenseStore;
