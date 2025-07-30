const router = require("express").Router();
const {
  AddTransaction,
  DeleteTransaction,
  UpdateTransaction,
  ShowTransaction,
  UpdateTransactionData,
} = require("../controllers/TransactionControllers");
const { userVerification } = require("../middlewares/AuthMiddleWare");

router.post("/addTransaction", userVerification, AddTransaction);
router.get("/allTransactions", userVerification, ShowTransaction);
router.get("/updatetransaction/:id", userVerification, UpdateTransactionData);
router.put("/updatetransaction/:id", userVerification, UpdateTransaction);
router.delete("/deleteTransaction/:id", userVerification, DeleteTransaction);

module.exports = router;
