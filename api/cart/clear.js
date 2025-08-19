const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");

module.exports = async (req, res) => {
  const user = await verifyToken(req, res);
  if (!user) return;

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Only DELETE method allowed" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    await db.collection("cart").updateOne(
      { userId: user.id },
      { $set: { items: [] } }
    );

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.error("❌ ClearCart Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

