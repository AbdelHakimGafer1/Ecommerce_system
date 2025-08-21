const { ObjectId } = require("mongodb");
const connectToDatabase = require("../../utils/db");
const logEvent = require("../../utils/logger");
const { verifyToken } = require("../../utils/auth");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET method allowed" });
  }

  // جلب الـ product ID من الرابط
  const id = req.url.split("/").pop();
  if (!id || id.length !== 24) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  // تحقق اختياري من المستخدم لتسجيل الاسم أو email
  let username = "guest";
  try {
    const user = await verifyToken(req);
    username = user?.email || "guest";
  } catch {}

  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    // جلب المنتج من قاعدة البيانات
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // تسجيل الحدث
    await logEvent({
      action: "product_viewed",
      user: username,
      meta: { productId: id },
    });

    // إرجاع بيانات المنتج
    res.status(200).json(product);
  } catch (err) {
    console.error("❌ Error getting product:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

