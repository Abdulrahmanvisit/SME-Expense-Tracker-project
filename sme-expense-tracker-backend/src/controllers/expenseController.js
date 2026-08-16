import Expense from "../models/Expense.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
  res.status(200).json({ success: true, data: expenses });
});

export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({ success: true, data: expense });
});

export const createExpense = asyncHandler(async (req, res) => {
  const { type, amount, categoryId, description, date } = req.body;

  if (!type || !amount || !categoryId || !date) {
    const error = new Error("Type, amount, categoryId, and date are required");
    error.statusCode = 400;
    throw error;
  }

  const expense = await Expense.create({
    type,
    amount,
    categoryId,
    description: description || "",
    date,
  });

  res.status(201).json({ success: true, data: expense });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(expense, req.body);
  await expense.save();

  res.status(200).json({ success: true, data: expense });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    const error = new Error("Expense not found");
    error.statusCode = 404;
    throw error;
  }

  await expense.deleteOne();
  res
    .status(200)
    .json({ success: true, message: "Expense deleted successfully" });
});
