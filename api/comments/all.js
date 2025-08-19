const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");

module.exports = async (req, res) => {
  const user = await verifyToken(req, res, true); // admin فقط
  if (!user) return;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET allowed" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const comments = await db.collection("comments").find().sort({ createdAt: -1 }).toArray();

    res.status(200).json({ comments });
  } catch (err) {
    console.error("❌ Get All Comments Error:", err.message);
    res.status(500).json({ message: "Server error while fetching all comments" });
  }
};

