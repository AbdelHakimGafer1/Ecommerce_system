const jwt = require("jsonwebtoken");
const connectToDatabase = require("../../utils/db");
const { sendResetEmail } = require("../../utils/mailer");

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

    // إنشاء token جديد
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // تخزين token مؤقت في DB مع صلاحية
    await db.collection("password_reset_tokens").insertOne({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 دقيقة
      createdAt: new Date()
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // إرسال البريد
    await sendResetEmail(email, resetLink);

    console.log("🔗 Reset Link:", resetLink);
    res.status(200).json({ message: "Reset link sent (check email or console)" });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

