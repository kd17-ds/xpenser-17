const router = require("express").Router();
const {
  SetBudget,
  ShowBudget,
  UpdateBudgetData,
  UpdateBudget,
  DeleteBudget,
} = require("../controllers/BudgetController");

router.post("/setbudget", SetBudget);
router.get("/showbudget", ShowBudget);
router.get("/updatebudget/:id", UpdateBudget);
router.put("/updatebudget/:id", UpdateBudgetData);
router.delete("/deletebudget/:id", DeleteBudget);

module.exports = router;
