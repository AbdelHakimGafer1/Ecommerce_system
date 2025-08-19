const bcrypt = require("bcryptjs");
const connectToDatabase = require("../../utils/db");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { username, email, password } = req.body;

  // التحقق من البيانات
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    // تأكد إن الإيميل مش موجود
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 12);

    // حفظ المستخدم
    const result = await db.collection("users").insertOne({
      username,
      email,
      role:"user",
      password: hashedPassword,
      createdAt: new Date(),
    });

    // استجابة بدون الباسورد
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.insertedId,
        username,

        email,
       role:"user",
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

