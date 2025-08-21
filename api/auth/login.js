const rateLimiter = require("../../utils/rateLimiter");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectToDatabase = require("../../utils/db");
const logEvent = require("../../utils/logger");

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // صلاحية Access Token ساعة
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // صلاحية Refresh Token 7 أيام
  );

  return { accessToken, refreshToken };
}

module.exports = async (req, res) => {
  const allowed = await rateLimiter(req, res);
  if (!allowed) return;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { email, password } = body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
               req.connection?.remoteAddress ||
               req.socket?.remoteAddress ||
               "unknown";

    const userAgent = req.headers["user-agent"] || "unknown";

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const user = await db.collection("users").findOne({ email });

    await logEvent({ action: "login_attempt", user: email, ip, userAgent, timestamp: new Date().toISOString() });

    if (!user) {
      await logEvent({ action: "login_failed_no_user", user: email, ip, userAgent, timestamp: new Date().toISOString() });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.loginAttempts = user.loginAttempts ?? 0;
    user.lockUntil = user.lockUntil ?? 0;

    const now = Date.now();
    if (user.lockUntil && user.lockUntil > now) {
      await logEvent({ action: "login_blocked_locked", user: email, ip, userAgent, timestamp: new Date().toISOString() });
      return res.status(403).json({ message: `Account is locked. Try again after ${new Date(user.lockUntil)}` });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      const attempts = user.loginAttempts + 1;
      const updates = { loginAttempts: attempts };

      if (attempts >= 5) {
        updates.lockUntil = now + 15 * 60 * 1000; // قفل الحساب 15 دقيقة
        await logEvent({ action: "account_locked_due_to_failed_attempts", user: email, ip, userAgent, timestamp: new Date().toISOString() });
      } else {
        await logEvent({ action: "login_failed_wrong_password", user: email, ip, userAgent, timestamp: new Date().toISOString() });
      }

      await db.collection("users").updateOne({ _id: user._id }, { $set: updates });
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Reset login attempts
    await db.collection("users").updateOne({ _id: user._id }, { $set: { loginAttempts: 0 }, $unset: { lockUntil: "" } });

    // توليد Access + Refresh Tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // حفظ Refresh Token في DB
    await db.collection("refresh_tokens").insertOne({
      userId: user._id,
      token: refreshToken,
      createdAt: new Date(),
    });

    await logEvent({ action: "login_success", user: email, ip, userAgent, timestamp: new Date().toISOString() });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email, role: user.role || "user" },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    await logEvent({ action: "login_crash", user: null, ip: "unknown", userAgent: "unknown", timestamp: new Date().toISOString(), error: error.message });
    res.status(500).json({ message: "Internal server error" });
  }
};

