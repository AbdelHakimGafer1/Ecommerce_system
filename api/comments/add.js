const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  const user = await verifyToken(req, res);
  if (!user) return;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { productId, comment } = body;

    if (!productId || !comment) {
      return res.status(400).json({ message: "Missing productId or comment" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const result = await db.collection("comments").insertOne({
      userId: new ObjectId(user.id),
      productId: new ObjectId(productId),
      comment,
      approved: false,
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Comment submitted for review", id: result.insertedId });
  } catch (err) {
    console.error("❌ Add Comment Error:", err.message);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

