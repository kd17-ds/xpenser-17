const router = require("express").Router();
const {
  SetBudget,
  ShowBudget,
  UpdateBudgetData,
  UpdateBudget,
  DeleteBudget,
} = require("../controllers/BudgetController");
const { userVerification } = require("../middlewares/AuthMiddleWare");

router.post("/setbudget", userVerification, SetBudget);
router.get("/showbudget", userVerification, ShowBudget);
router.get("/updatebudget/:id", userVerification, UpdateBudget);
router.put("/updatebudget/:id", userVerification, UpdateBudgetData);
router.delete("/deletebudget/:id", userVerification, DeleteBudget);

module.exports = router;
