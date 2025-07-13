const BudgetModel = require("../models/BudgetModel.js");

module.exports.SetBudget = async (req, res) => {
  try {
    const budgets = req.body.budgets;

    if (!Array.isArray(budgets) || budgets.length === 0) {
      return res.status(400).json({ error: "No budget data provided" });
    }

    const inserted = await BudgetModel.insertMany(budgets);

    console.log(inserted);
    res.status(201).json({ message: "Budgets set for all categories!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to set budgets." });
  }
};

module.exports.ShowBudget = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = {};
    if (month) query.month = month;
    if (year) query.year = year;

    const allBudget = await BudgetModel.find(query);
    res.status(200).json(allBudget);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch Budgets" });
  }
};

module.exports.UpdateBudget = async (req, res) => {
  try {
    const { month, year } = req.query;
    const monthlyBudget = await BudgetModel.find({ month, year });
    if (!monthlyBudget || monthlyBudget.length === 0) {
      return res.status(404).json({ error: "Budget not found" });
    }

    res.status(200).json(monthlyBudget);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.UpdateBudgetData = async (req, res) => {
  try {
    const { month, year, categories, originalMonth, originalYear } = req.body;

    const updateResult = await BudgetModel.updateOne(
      { month: originalMonth, year: originalYear },
      {
        $set: {
          month,
          year,
          ...Object.fromEntries(
            Object.entries(categories).map(([cat, amt]) => [
              `categories.${cat}`,
              amt,
            ])
          ),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Original budget not found" });
    }

    res.status(200).json({ message: "Budget updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.DeleteBudget = async (req, res) => {
  try {
    const { month, year } = req.query;

    const deleted = await BudgetModel.deleteMany({ month, year });

    if (deleted.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "No budgets found for given month/year" });
    }

    res.status(200).json({ message: "Budgets deleted!" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
