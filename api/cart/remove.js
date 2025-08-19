const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  const user = await verifyToken(req, res);
  if (!user) return;

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Only DELETE method allowed" });
  }

  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const result = await db.collection("cart").updateOne(
      { userId: user.id },
      { $pull: { items: { productId: new ObjectId(productId) } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    res.status(200).json({ message: "Removed from cart" });
  } catch (err) {
    console.error("❌ RemoveFromCart Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

