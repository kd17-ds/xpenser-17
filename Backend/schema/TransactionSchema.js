const { Schema } = require("mongoose");

const TransactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Food",
      "Rent",
      "Travel",
      "Utilities",
      "Entertainment",
      "Grocery",
      "Shopping",
      "Healthcare",
      "Education",
      "Other",
    ],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { TransactionSchema };
