const BudgetModel = require("../models/BudgetModel.js");

module.exports.SetBudget = async (req, res) => {
  try {
    const { month, year, categories } = req.body;

    if (
      !month ||
      !year ||
      !categories ||
      typeof categories !== "object" ||
      Array.isArray(categories)
    ) {
      return res.status(400).json({
        error:
          "Invalid budget format. Please provide valid month, year, and category values.",
      });
    }

    const existing = await BudgetModel.findOne({
      month,
      year,
      userId: req.user._id,
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: `A budget for ${month} ${year} already exists.` });
    }

    await BudgetModel.create({ month, year, categories, userId: req.user._id });
    res.status(201).json({
      message: `Budget for ${month} ${year} has been successfully created.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to set budget." });
  }
};

module.exports.ShowBudget = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { userId: req.user._id };
    if (month) query.month = month;
    if (year) query.year = year;

    const allBudget = await BudgetModel.find(query);
    res.status(200).json(allBudget);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch Budget" });
  }
};

module.exports.UpdateBudget = async (req, res) => {
  try {
    const id = req.params.id;
    const monthlyBudget = await BudgetModel.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!monthlyBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    res.status(200).json(monthlyBudget);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.UpdateBudgetData = async (req, res) => {
  try {
    const { month, year, categories } = req.body;

    const existing = await BudgetModel.findOne({
      month,
      year,
      userId: req.user._id,
    });

    if (existing && existing._id.toString() !== req.params.id) {
      return res.status(409).json({
        error: `A budget for ${month} ${year} already exists. Please choose a different month or year.`,
      });
    }

    const updateResult = await BudgetModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { month, year, categories },
      { new: true }
    );

    if (!updateResult) {
      return res.status(404).json({ error: "Budget not found" });
    }

    res.status(200).json({
      message: `Budget for ${month} ${year} has been updated successfully.`,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports.DeleteBudget = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBudget = await BudgetModel.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deletedBudget) {
      return res.status(404).json({ error: "Budget not found" });
    }

    res.status(200).json({
      message: `Budget for ${deletedBudget.month} ${deletedBudget.year} has been successfully deleted.`,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete budget" });
  }
};
