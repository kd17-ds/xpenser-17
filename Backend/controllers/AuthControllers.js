// Import required modules and utilities
const UsersModel = require("../models/UsersModel.js");
const {
  createSecretToken, // Generates JWT for login sessions
  emailVerificationToken, // Generates JWT for email verification
  createResetToken, // Generates JWT for password reset
} = require("../utils/secretToken.js");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/sendEmail.js");
const jwt = require("jsonwebtoken");

// -------------------- SIGNUP --------------------
module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user (password hashing should ideally happen in a Mongoose pre-save hook)
    const user = await UsersModel.create({
      email,
      password,
      username,
      createdAt,
    });

    // Generate verification token and prepare verification URL
    const verificationToken = emailVerificationToken(user._id);
    const verificationUrl = `${process.env.CLIENT_URL}/verifyemail?token=${verificationToken}`;

    // Send verification email
    await sendEmail(
      user.email,
      "Verify your Xpenser account",
      `<a href="${verificationUrl}">Click here to verify your account</a>`
    );

    // Send success response
    res.status(201).json({
      message: "User signed up successfully, Verification Email Sent",
      success: true,
      user,
    });

    // Not really needed since response is already sent
    next();
  } catch (error) {
    // Handle duplicate email error specifically
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Signup failed", error });
  }
};

// -------------------- LOGIN --------------------
module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic field validation
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }

    // Find user by email
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }

    // Check if email is verified
    if (!user.verified) {
      return res.json({
        message: "Please verify your email before logging in.",
      });
    }

    // Compare passwords
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }

    // Create JWT token
    const token = createSecretToken(user._id);

    // Send token as an HTTP-only cookie
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      sameSite: "Lax", // Cross-site requests allowed for same site
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    // Send login success response
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

// -------------------- VERIFY EMAIL --------------------
module.exports.VerifyEmail = async (req, res) => {
  const token = req.query.token;

  // If no token provided
  if (!token) {
    return res.json({ status: false });
  }

  try {
    // Verify token with EMAIL_SECRET
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    // Update user verified status
    const user = await UsersModel.findByIdAndUpdate(decoded.id, {
      verified: true,
    });

    if (user) return res.json({ status: true, user: user.username });
  } catch (error) {
    return res.json({ status: false });
  }
};

// -------------------- FORGOT PASSWORD --------------------
module.exports.ForgotPass = async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.json({ message: "No User exists with the email" });
    }

    // Create reset token and URL
    const token = createResetToken(user._id);
    const resetPassUrl = `${process.env.CLIENT_URL}/forgotpass?token=${token}`;

    // Send password reset email
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

// -------------------- RESET PASSWORD --------------------
module.exports.ResetPass = async (req, res) => {
  const token = req.query.token;

  // If token missing
  if (!token) {
    return res.json({ status: false });
  }

  try {
    // Verify reset token
    const allowReset = jwt.verify(token, process.env.RESET_SECRET);

    const { password } = req.body;

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password
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

// -------------------- VERIFY USER FROM COOKIE --------------------
module.exports.VerifyUserFromCookie = async (req, res) => {
  const token = req.cookies.token;

  // If no token found
  if (!token) {
    return res.json({ status: false });
  }

  try {
    // Decode token and find user
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await UsersModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.json({ status: false });
    }

    // Return user data
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

// -------------------- LOGOUT --------------------
module.exports.LogoutUser = (req, res) => {
  // Clear auth token cookie
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax", // Or "None" if cross-domain + HTTPS
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};
