

const jwt = require("jsonwebtoken");
const connectToDatabase = require("./db");

async function verifyToken(req, requireAdmin = false) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET); // Access Token
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // صلاحية Access Token انتهت
      throw new Error("ACCESS_TOKEN_EXPIRED");
    } else {
      throw new Error("Invalid token");
    }
  }

  // تحقق من Blacklist
  const client = await connectToDatabase();
  const db = client.db("ecommerce");
  const blacklisted = await db.collection("token_blacklist").findOne({ token });
  if (blacklisted) {
    throw new Error("Token is blacklisted. Please login again.");
  }

  if (requireAdmin && decoded.role !== "admin") {
    throw new Error("Unauthorized: Admin only");
  }

  return decoded; // { id, email, role, username }
}

async function refreshAccessToken(refreshToken) {
  const client = await connectToDatabase();
  const db = client.db("ecommerce");

  const tokenDoc = await db.collection("refresh_tokens").findOne({ token: refreshToken });
  if (!tokenDoc) throw new Error("Invalid refresh token");

  // تحقق من صلاحية refresh token
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Access Token جديد
    );
    return newAccessToken;
  } catch (err) {
    throw new Error("Refresh token expired");
  }
}

module.exports = { verifyToken, refreshAccessToken };

