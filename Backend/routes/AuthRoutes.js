const {
  Signup,
  Login,
  VerifyEmail,
  ForgotPass,
  ResetPass,
  VerifyUserFromCookie,
  LogoutUser,
} = require("../controllers/AuthControllers");
const router = require("express").Router();
const { userVerification } = require("../middlewares/AuthMiddleWare");

router.post("/", userVerification);
router.post("/signup", Signup);
router.post("/login", Login);
router.get("/verifyemail", VerifyEmail);
router.post("/forgotpass", ForgotPass);
router.post("/resetpass", ResetPass);
router.get("/verifyUser", VerifyUserFromCookie);
router.get("/logout", LogoutUser);

module.exports = router;
