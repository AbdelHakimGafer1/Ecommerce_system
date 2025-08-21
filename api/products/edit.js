const { ObjectId } = require("mongodb");
const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const logEvent = require("../../utils/logger");

// Rate limiting بسيط لكل مستخدم
const rateLimitWindow = 60000; // 1 دقيقة
const maxRequests = 10;
const rateLimitStore = {};

function checkRateLimit(userId) {
  const now = Date.now();
  if (!rateLimitStore[userId]) rateLimitStore[userId] = [];
  rateLimitStore[userId] = rateLimitStore[userId].filter(ts => now - ts < rateLimitWindow);
  if (rateLimitStore[userId].length >= maxRequests) return false;
  rateLimitStore[userId].push(now);
  return true;
}

module.exports = async (req, res) => {
  // تحقق من Admin + توكن
  let user;
  try {
    user = await verifyToken(req, true); // Admin فقط
    req.user = user;
  } catch (err) {
    if (err.message === "ACCESS_TOKEN_EXPIRED") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: err.message });
  }

  // Rate limiting
  if (!checkRateLimit(user.id)) {
    return res.status(429).json({ message: "Too many requests. Try again later." });
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Only PUT requests allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { id, ...updates } = body;

    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // التحقق من الحقول الأساسية قبل التحديث
    if (updates.price && (isNaN(updates.price) || updates.price <= 0)) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    if (updates.stock && (isNaN(updates.stock) || updates.stock < 0)) {
      return res.status(400).json({ message: "Stock must be 0 or more" });
    }

    // تنظيف النصوص
    if (updates.title) updates.title = updates.title.trim();
    if (updates.description) updates.description = updates.description.trim();

    updates.updatedAt = new Date();

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await logEvent({
      action: "product_updated",
      user: req.user.email,
      meta: { productId: id, updates },
    });

    return res.status(200).json({ message: "Product updated successfully" });

  } catch (error) {
    console.error("❌ Edit Product Error:", error.message);
    await logEvent({
      action: "product_update_failed",
      user: req.user.email,
      meta: { error: error.message },
    });
    return res.status(500).json({ message: "Server error while updating product" });
  }
};

