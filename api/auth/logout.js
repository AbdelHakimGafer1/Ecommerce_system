const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const user = verifyToken(req);
    const token = req.headers.authorization.split(" ")[1];

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    // 🔍 تحقق هل التوكن موجود بالفعل في blacklist
    const existing = await db.collection("token_blacklist").findOne({ token });
    if (existing) {
      return res.status(400).json({ message: "Token already blacklisted" });
    }

    await db.collection("token_blacklist").insertOne({
      token,
      userId: user.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // أسبوع
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

