const TransactionModel = require("../models/TransactionModel.js");

module.exports.AddTransaction = async (req, res) => {
  try {
    const { amount, type, category, name } = req.body;

    const Transaction = await TransactionModel.create({
      amount,
      type,
      category,
      name,
    });

    console.log(Transaction);
    res.status(201).json({ message: "Transaction added!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports.ShowTransaction = async (req, res) => {
  try {
    const allTransactions = await TransactionModel.find({});
    res.status(200).json(allTransactions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

module.exports.UpdateTransaction = async (req, res) => {};
module.exports.DeleteTransaction = async (req, res) => {};
