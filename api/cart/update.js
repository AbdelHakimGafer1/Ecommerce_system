const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  const user = await verifyToken(req, res);
  if (!user) return;

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Only PATCH method allowed" });
  }

  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({ message: "Product ID and new quantity are required" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const result = await db.collection("cart").updateOne(
      { userId: user.id, "items.productId": new ObjectId(productId) },
      { $set: { "items.$.quantity": quantity } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    res.status(200).json({ message: "Quantity updated" });
  } catch (err) {
    console.error("❌ UpdateCart Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

