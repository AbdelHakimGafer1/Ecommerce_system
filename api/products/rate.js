const { ObjectId } = require("mongodb");
const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const logEvent = require("../../utils/logger");

module.exports = async (req, res) => {
  const allowed = await verifyToken(req, res, false); // أي مستخدم مسموح له
  if (!allowed) return;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST method allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { id, rating } = body;

    if (!id || id.length !== 24 || isNaN(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating or product ID" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newRating = (product.rating + rating) / 2;

    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: { rating: parseFloat(newRating.toFixed(2)), updatedAt: new Date() } }
    );

    await logEvent({
      action: "product_rated",
      user: req.user?.email || "unknown",
      meta: { productId: id, rating }
    });

    res.status(200).json({ message: "Product rated successfully", rating: newRating });
  } catch (err) {
    console.error("❌ Product Rating Error:", err.message);
    res.status(500).json({ message: "Server error while rating product" });
  }
};

