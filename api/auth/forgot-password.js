const jwt = require("jsonwebtoken");
const connectToDatabase = require("../../utils/db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { email } = body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🛡️ إنشاء توكن صالح لـ 15 دقيقة فقط
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 💡 في الحالة الحقيقية بنبعت إيميل، لكن هنا نطبع الرابط فقط
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    console.log("🔗 Reset Link:", resetLink);
const { sendResetEmail } = require("../../utils/mailer");
await sendResetEmail(email, resetLink);

    res.status(200).json({ message: "Reset link generated (check console)" });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

