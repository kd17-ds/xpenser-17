const UsersModel = require("../models/UsersModel.js");
const {
  createSecretToken,
  emailVerificationToken,
  createResetToken,
} = require("../utils/secretToken.js");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/sendEmail.js");
const sendResponse = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Sign Up
module.exports.Signup = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return sendResponse(
        res,
        409,
        false,
        "User with this email already exists"
      );
    }

    const user = await UsersModel.create({
      name,
      email,
      password,
      username,
    });

    // Generate verification token and prepare verification URL
    const verificationToken = emailVerificationToken(user._id);
    const verificationUrl = `${CLIENT_URL}/verifyemail?token=${verificationToken}`;

    // Send verification email
    await sendEmail(
      user.email,
      "Verify your Xpenser account",
      ` <p>Thank you for registering with Xpenser. To complete your account setup and start managing your finances, please verify your email address by clicking the link below:</p>
        <p><a href="${verificationUrl}" style="color: #1a73e8; text-decoration: none;">Verify My Account</a></p>
        <p>If you did not create an account with us, please ignore this email.</p>
        <p>Best regards,<br/>The Xpenser Team</p>`
    );

    return sendResponse(
      res,
      201,
      true,
      "User signed up successfully, Verification Email Sent",
      { user }
    );
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      return sendResponse(
        res,
        409,
        false,
        "User with this email already exists"
      );
    }

    if (error.name === "ValidationError") {
      return sendResponse(res, 400, false, "All fields are required");
    }

    console.error(error);
    return sendResponse(
      res,
      500,
      false,
      "Signup failed. Please try again later."
    );
  }
};

// Login
module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    const user = await UsersModel.findOne({ email });
    if (!user) {
      return sendResponse(res, 401, false, "Incorrect password or email");
    }

    if (!user.verified) {
      return sendResponse(
        res,
        403,
        false,
        "Please verify your email before logging in."
      );
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return sendResponse(res, 401, false, "Incorrect password or email");
    }

    const token = createSecretToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, // Cookie cannot be accessed via JavaScript (prevents XSS attacks)
      sameSite: "Lax", // Helps prevent CSRF; allows sending cookie on top-level navigations
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 200, true, "User logged in successfully", {
      user: {
        id: user._id,
        verified: user.verified,
        username: user.username,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, "Login failed");
  }
};

// Verify Email
module.exports.VerifyEmail = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return sendResponse(res, 200, false, "Verification token is missing.");
  }

  try {
    // Verify token with EMAIL_SECRET
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    // Update user verified status
    const user = await UsersModel.findByIdAndUpdate(
      decoded.id,
      { verified: true },
      { new: true }
    );

    if (!user) {
      return sendResponse(
        res,
        404,
        false,
        "User not found or already verified."
      );
    }

    return sendResponse(res, 200, true, "Email verified successfully.", {
      user: user.username,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendResponse(res, 400, false, "Verification token has expired.");
    }

    if (error.name === "JsonWebTokenError") {
      return sendResponse(res, 400, false, "Invalid verification token.");
    }

    return sendResponse(
      res,
      500,
      false,
      "Something went wrong while verifying email."
    );
  }
};

// Forgot Password
module.exports.ForgotPass = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendResponse(
      res,
      400,
      false,
      "Please provide a valid email address"
    );
  }

  try {
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, false, "No user exists with this email");
    }

    // Create reset token and URL
    const token = createResetToken(user._id);
    const resetPassUrl = `${CLIENT_URL}/forgotpass?token=${token}`;

    // Send password reset email
    await sendEmail(
      user.email,
      "Password Reset Request - Xpenser",
      `
    <p>We received a request to reset the password for your Xpenser account associated with this email address.</p>
    <p>If you made this request, please click the button below to set a new password:</p>
    <p>
      <a 
        href="${resetPassUrl}" 
        style="display:inline-block;padding:10px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:5px;font-weight:bold;"
      >
        Reset Password
      </a>
    </p>
    <p>This link will expire in 10 minutes for your security.</p>
    <p>If you did not request a password reset, you can safely ignore this email and your password will remain unchanged.</p>
    <br>
    <p>Thanks,</p>
    <p><strong>The Xpenser Team</strong></p>
  `
    );

    return sendResponse(res, 200, true, "Password reset email sent");
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, false, "Something went wrong");
  }
};

// Reset Password
module.exports.ResetPass = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return sendResponse(res, 400, false, "Password reset token is required");
  }

  try {
    const allowReset = jwt.verify(token, process.env.RESET_SECRET);

    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const updatedUser = await UsersModel.findByIdAndUpdate(allowReset.id, {
      password: hashedPassword,
    });

    if (updatedUser) {
      return sendResponse(res, 200, true, "Password changed successfully");
    } else {
      return sendResponse(res, 404, false, "User not found");
    }
  } catch (error) {
    console.error("ResetPass error:", error);

    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return sendResponse(res, 400, false, "Token expired or invalid");
    }

    return sendResponse(res, 500, false, "Something went wrong");
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
