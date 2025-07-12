const { Schema } = require("mongoose");

const BudgetSchema = new Schema({
  amount: {
    type: Number,
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
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

module.exports = { BudgetSchema };
