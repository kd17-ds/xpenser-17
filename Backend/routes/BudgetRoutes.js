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
router.get("/updatebudget/", UpdateBudget);
router.put("/updatebudget/", UpdateBudgetData);
router.delete("/deletebudget/", DeleteBudget);

module.exports = router;
