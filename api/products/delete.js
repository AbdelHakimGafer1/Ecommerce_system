const { ObjectId } = require("mongodb");
const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const logEvent = require("../../utils/logger");

module.exports = async (req, res) => {
  const allowed = await verifyToken(req, res, true); // 🔐 Admin فقط
  if (!allowed) return;

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Only DELETE method allowed" });
  }

  try {
    const { id } = req.query;
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await logEvent({
      action: "product_deleted",
      user: req.user?.email || "unknown",
      meta: { productId: id },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Product Error:", err.message);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};

