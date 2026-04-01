import mongoose from "mongoose";

/**
 * Single ledger row from uploaded Excel/CSV.
 * `type` distinguishes money in vs money out for cash flow and anomaly logic.
 */
const transactionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, index: true },
    amount: { type: Number, required: true },
    vendor: { type: String, required: true, trim: true, default: "Unknown" },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: { type: String, trim: true, default: "General" },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
