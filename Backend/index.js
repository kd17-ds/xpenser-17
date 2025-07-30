// Load environment variables from .env (only in dev mode)
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_URL;
const bodyParser = require("body-parser");
const cors = require("cors");
const transactionRoute = require("./routes/TransactionRoute");
const budgetRoutes = require("./routes/BudgetRoutes");
const authRoute = require("./routes/AuthRoutes");
const cookieParser = require("cookie-parser");

app.use(express.static(path.join(__dirname, "client", "dist")));
app.set("trust proxy", 1);

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", authRoute);
app.use("/", transactionRoute);
app.use("/", budgetRoutes);

app.get(
  /^\/(?!setbudget|login|signup|showbudget|addTransaction|allTransactions|verifyemail|forgotpass|resetpass|verifyUser|logout|updatebudget|deletebudget|updatetransaction|deleteTransaction).*/,
  (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  }
);

main()
  .then((res) => {
    console.log("DATABASE CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(port, () => {
  console.log("Server is running on port 5000");
});
