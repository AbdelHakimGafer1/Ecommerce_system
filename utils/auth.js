const jwt = require("jsonwebtoken");
const connectToDatabase = require("./db");

async function verifyToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 💣 تحقق من blacklist
  const client = await connectToDatabase();
  const db = client.db("ecommerce");

  const blacklisted = await db.collection("token_blacklist").findOne({ token });
  if (blacklisted) {
    throw new Error("Token is blacklisted. Please login again.");
  }

  return decoded; // ← فيه role, id, email
}

module.exports = { verifyToken };

