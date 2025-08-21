const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Only POST allowed" });

  try {
    // تحقق من Access Token
    let user;
    try {
      user = await verifyToken(req); // أي مستخدم مسجل
    } catch (err) {
      if (err.message === "ACCESS_TOKEN_EXPIRED") {
        return res.status(401).json({ message: "Access token expired. Please refresh your token." });
      }
      return res.status(401).json({ message: err.message });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { productId, comment } = body;

    if (!productId || !comment) return res.status(400).json({ message: "Missing productId or comment" });
    if (productId.length !== 24) return res.status(400).json({ message: "Invalid productId" });
    if (comment.length > 500) return res.status(400).json({ message: "Comment too long" });

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const result = await db.collection("comments").insertOne({
      userId: new ObjectId(user.id),
      productId: new ObjectId(productId),
      comment,
      approved: false, // يحتاج موافقة Admin
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Comment submitted for review", id: result.insertedId });
  } catch (err) {
    console.error("❌ Add Comment Error:", err.message);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

