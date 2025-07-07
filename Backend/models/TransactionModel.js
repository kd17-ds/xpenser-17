const { model } = require("mongoose");

const { TransactionSchema } = require("../schema/TransactionSchema");

const TransactionModel = new model("Transaction", TransactionSchema);

module.exports = TransactionModel;
