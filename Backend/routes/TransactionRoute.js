const router = require("express").Router();
const {
  AddTransaction,
  DeleteTransaction,
  UpdateTransaction,
  ShowTransaction,
} = require("../controllers/TransactionControllers");

router.post("/addTransaction", AddTransaction);
router.get("/allTransaction", ShowTransaction);
router.put("/updateTransaction", UpdateTransaction);
router.delete("/deleteTransaction", DeleteTransaction);

module.exports = router;
