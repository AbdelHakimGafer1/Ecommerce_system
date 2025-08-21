const { ObjectId } = require("mongodb");
const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const logEvent = require("../../utils/logger");

module.exports = async (req, res) => {
  // توثيق المستخدم
  let user;
  try {
    user = await verifyToken(req); // أي مستخدم
    req.user = user;
  } catch (err) {
    if (err.message === "ACCESS_TOKEN_EXPIRED") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: err.message });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST method allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { id, rating } = body;

    // تحقق من صحة البيانات
    if (!id || id.length !== 24 || isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating or product ID" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // حساب متوسط التقييم بدقة أكبر
    const { rating: currentRating = 0, ratingCount = 0 } = product;
    const newRating = ((currentRating * ratingCount) + rating) / (ratingCount + 1);

    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { rating: parseFloat(newRating.toFixed(2)), updatedAt: new Date() },
        $inc: { ratingCount: 1 }
      }
    );

    // Logging
    await logEvent({
      action: "product_rated",
      user: req.user.email,
      meta: { productId: id, rating }
    });

    return res.status(200).json({
      message: "Product rated successfully",
      rating: parseFloat(newRating.toFixed(2)),
      ratingCount: ratingCount + 1
    });

  } catch (err) {
    console.error("❌ Product Rating Error:", err.message);
    await logEvent({
      action: "product_rating_failed",
      user: req.user.email,
      meta: { error: err.message }
    });
    return res.status(500).json({ message: "Server error while rating product" });
  }
};

