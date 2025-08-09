const User = require("../models/UsersModel"); // Import the User model to interact with the database
require("dotenv").config(); // Load environment variables from the .env file
const jwt = require("jsonwebtoken"); // Import JSON Web Token library for token verification

// Middleware function to verify a user's authentication token
module.exports.userVerification = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // If no token is found, send 401 Unauthorized
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Find the user by ID extracted from the decoded token
    const user = await User.findById(decoded.id);

    // If user is not found in the database, return 401 Unauthorized
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token or user not found" });
    }

    // Attach user object to the request for use in later middleware/routes
    req.user = user;

    // Pass control to the next middleware or route handler
    next();
  } catch (err) {
    // Log the error for debugging purposes
    console.error("User verification failed:", err);

    // Send a 401 Unauthorized response if token is invalid or expired
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
