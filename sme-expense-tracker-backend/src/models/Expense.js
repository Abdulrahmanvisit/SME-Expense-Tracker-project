import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["expense", "income"],
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    categoryId: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

expenseSchema.index({ date: -1 });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
