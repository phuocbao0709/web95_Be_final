import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { apiKey } = req.query;

    if (!apiKey) {
      return res.status(401).json({
        message: "apiKey is required in query parameters",
      });
    }

    // Find user by apiKey
    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(401).json({
        message: "Invalid or expired apiKey",
      });
    }

    // Attach user to request for later use
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error during authentication",
      error: error.message,
    });
  }
};
