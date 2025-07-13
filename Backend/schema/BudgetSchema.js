const { Schema } = require("mongoose");

const BudgetSchema = new Schema({
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  categories: {
    type: Map,
    of: Number,
    required: true,
  },
});

module.exports = { BudgetSchema };
