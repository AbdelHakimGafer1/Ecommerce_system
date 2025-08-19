const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");

module.exports = async (req, res) => {
  const user = await verifyToken(req, res);
  if (!user) return;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET method allowed" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const cart = await db.collection("cart").findOne({ userId: user.id });

    res.status(200).json(cart || { items: [] });
  } catch (err) {
    console.error("❌ GetCart Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

