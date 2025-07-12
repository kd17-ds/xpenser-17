const BudgetModel = require("../models/BudgetModel.js");

module.exports.SetBudget = async (req, res) => {
  try {
    const { amount, category, month, year } = req.body;

    const Budget = await BudgetModel.create({
      amount,
      category,
      month,
      year,
    });

    console.log(Budget);
    res.status(201).json({ message: "Budget Set!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports.ShowBudget = async (req, res) => {
  try {
    const allBudget = await BudgetModel.find({});
    res.status(200).json(allBudget);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch Budgets" });
  }
};

module.exports.UpdateBudget = async (req, res) => {
  try {
    const id = req.params.id;
    const updateBudget = await BudgetModel.findById(id);
    if (!updateBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }
    res.status(200).json(updateBudget);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.UpdateBudgetData = async (req, res) => {
  try {
    const { amount, category, month, year } = req.body;
    const id = req.params.id;
    const updatedBudget = await BudgetModel.findByIdAndUpdate(
      id,
      {
        amount,
        category,
        month,
        year,
      },
      { new: true }
    );
    if (!updatedBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }
    console.log(updatedBudget);
    res.status(201).json({ message: "Budget Updated!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.DeleteBudget = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBudget = await BudgetModel.findByIdAndDelete(id);

    if (!deletedBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    console.log(deletedBudget);
    res.status(200).json({ message: "Budget Deleted!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
