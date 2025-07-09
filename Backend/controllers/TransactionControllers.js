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

module.exports.UpdateTransactionData = async (req, res) => {
  try {
    const id = req.params.id;
    const updateTransaction = await TransactionModel.findById(id);
    if (!updateTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(updateTransaction);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.UpdateTransaction = async (req, res) => {
  try {
    const { amount, type, category, name, date } = req.body;
    const id = req.params.id;
    const updatedTransaction = await TransactionModel.findByIdAndUpdate(
      id,
      {
        amount,
        type,
        category,
        name,
        date,
      },
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    console.log(updatedTransaction);
    res.status(201).json({ message: "Transaction Updated!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.DeleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTransaction = await TransactionModel.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    console.log(deletedTransaction);
    res.status(200).json({ message: "Transaction Deleted!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
