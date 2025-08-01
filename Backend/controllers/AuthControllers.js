const UsersModel = require("../models/UsersModel.js");
const {
  createSecretToken,
  emailVerificationToken,
  createResetToken,
} = require("../utils/secretToken.js");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/sendEmail.js");
const jwt = require("jsonwebtoken");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await UsersModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const user = await UsersModel.create({
      email,
      password,
      username,
      createdAt,
    });

    const verificationToken = emailVerificationToken(user._id);
    const verificationUrl = `${process.env.CLIENT_URL}/verifyemail?token=${verificationToken}`;

    await sendEmail(
      user.email,
      "Verify your Xpenser account",
      `<a href="${verificationUrl}">Click here to verify your account</a>`
    );
    res.status(201).json({
      message: "User signed up successfully, Verification Email Sent",
      success: true,
      user,
    });
    next();
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Signup failed", error });
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }

    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    if (!user.verified) {
      return res.json({
        message: "Please verify your email before logging in.",
      });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 3 * 24 * 60 * 60 * 1000, // ✅ 3 days in milliseconds
    });
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: user._id,
        verified: user.verified,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports.VerifyEmail = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.json({ status: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    const user = await UsersModel.findByIdAndUpdate(decoded.id, {
      verified: true,
    });

    if (user) return res.json({ status: true, user: user.username });
  } catch (error) {
    return res.json({ status: false });
  }
};

module.exports.ForgotPass = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UsersModel.findOne({ email });

    if (!user) {
      return res.json({ message: "No User exists with the email" });
    }

    const token = createResetToken(user._id);
    const resetPassUrl = `${process.env.CLIENT_URL}/forgotpass?token=${token}`;

    await sendEmail(
      user.email,
      "Reset Your Password - Xpenser",
      `<p>Click below to reset your password:</p>
     <a href="${resetPassUrl}">Reset Password</a>`
    );

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    return res.json({ status: false });
  }
};

module.exports.ResetPass = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.json({ status: false });
  }

  try {
    const allowReset = jwt.verify(token, process.env.RESET_SECRET);
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedUser = await UsersModel.findByIdAndUpdate(allowReset.id, {
      password: hashedPassword,
    });

    if (updatedUser) {
      return res.json({ message: "Password changed successfully" });
    } else {
      return res.json({ message: "User not found" });
    }
  } catch (error) {
    return res.json({ status: false, message: "Token expired or invalid" });
  }
};

module.exports.VerifyUserFromCookie = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ status: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await UsersModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.json({ status: false });
    }

    res.json({
      status: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    return res.json({ status: false });
  }
};

module.exports.LogoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax", // Or "None" if frontend is on a different domain with HTTPS
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};
