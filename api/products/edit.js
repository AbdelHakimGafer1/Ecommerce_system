const { ObjectId } = require("mongodb");
const connectToDatabase = require("../../utils/db");
const{ verifyToken} = require("../../utils/auth");
const logEvent = require("../../utils/logger");

module.exports = async (req, res) => {
  const allowed = await verifyToken(req, res, true); // Admin فقط
  if (!allowed) return;

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Only PUT requests allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { id, ...updates } = body;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    updates.updatedAt = new Date();

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await logEvent({
      action: "product_updated",
      user: req.user?.email || "unknown",
      meta: { productId: id, updates },
    });

    res.status(200).json({ message: "Product updated successfully" });

  } catch (error) {
    console.error("❌ Edit Product Error:", error.message);
    await logEvent({
      action: "product_update_failed",
      user: req.user?.email || "unknown",
      meta: { error: error.message },
    });
    res.status(500).json({ message: "Server error while updating product" });
  }
};

