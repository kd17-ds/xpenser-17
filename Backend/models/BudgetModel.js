const { model } = require("mongoose");

const { BudgetSchema } = require("../schema/BudgetSchema");

const BudgetModel = new model("Budget", BudgetSchema);

module.exports = BudgetModel;
