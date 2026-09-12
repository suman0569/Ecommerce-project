
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (
    authHeader &&
    typeof authHeader === "string" &&
    authHeader.startsWith("Bearer ")
  ) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }
};

module.exports = { protect };
