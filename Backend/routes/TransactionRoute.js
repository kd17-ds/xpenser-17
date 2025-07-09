const router = require("express").Router();
const {
  AddTransaction,
  DeleteTransaction,
  UpdateTransaction,
  ShowTransaction,
  UpdateTransactionData,
} = require("../controllers/TransactionControllers");

router.post("/addTransaction", AddTransaction);
router.get("/allTransactions", ShowTransaction);
router.get("/updatetransaction/:id", UpdateTransactionData);
router.put("/updatetransaction/:id", UpdateTransaction);
router.delete("/deleteTransaction/:id", DeleteTransaction);

module.exports = router;
