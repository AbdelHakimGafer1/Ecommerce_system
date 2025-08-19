const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connectToDatabase = require("../../utils/db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { token, newPassword } = body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Token and new password are required" });

    // 🧠 تحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.collection("users").updateOne(
      { email: decoded.email },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

