const TransactionModel = require("../models/TransactionModel.js");

module.exports.AddTransaction = async (req, res) => {
  try {
    const { amount, type, category, name, date } = req.body;

    const transaction = await TransactionModel.create({
      amount,
      type,
      category,
      name,
      date,
      userId: req.user._id,
    });

    res.status(201).json({ message: "Transaction added!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports.ShowTransaction = async (req, res) => {
  try {
    const allTransactions = await TransactionModel.find({
      userId: req.user._id,
    });
    res.status(200).json(allTransactions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

module.exports.UpdateTransactionData = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await TransactionModel.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.UpdateTransaction = async (req, res) => {
  try {
    const { amount, type, category, name, date } = req.body;
    const id = req.params.id;

    const updated = await TransactionModel.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { amount, type, category, name, date },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(201).json({ message: "Transaction updated!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.DeleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await TransactionModel.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
