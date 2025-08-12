require("dotenv").config();
const jwt = require("jsonwebtoken");

// Token for authentication
module.exports.createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 30 * 24 * 60 * 60,
  });
};

// Token for email verification
module.exports.emailVerificationToken = (id) => {
  return jwt.sign({ id }, process.env.EMAIL_SECRET, {
    expiresIn: "1h",
  });
};

// Token for password reset
module.exports.createResetToken = (id) => {
  return jwt.sign({ id }, process.env.RESET_SECRET, {
    expiresIn: "10m",
  });
};
