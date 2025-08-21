require('dotenv').config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectToDatabase = require("../../db"); // ✅ يستدعي db.js


// Helper function لتوليد tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // صلاحية الـ Access Token ساعة
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // صلاحية الـ Refresh Token 7 أيام
  );

  return { accessToken, refreshToken };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const db = await connectToDatabase();

    // Check existing user
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    const result = await db.collection("users").insertOne({
      username,
      email,
      role: "user",
      password: hashedPassword,
      createdAt: new Date(),
    });

    const user = {
      _id: result.insertedId,
      username,
      email,
      role: "user",
    };

    // توليد الـ tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // حفظ الـ Refresh Token في DB (آمن)
    await db.collection("refresh_tokens").insertOne({
      userId: user._id,
      token: refreshToken,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
  console.error("❌ Registration error:", error);
  res.status(500).json({ message: error.message, stack: error.stack });
}

};

