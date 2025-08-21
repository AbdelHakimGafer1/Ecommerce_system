const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Only PATCH allowed" });

  try {
    // تحقق من Access Token وAdmin
    let user;
    try {
      user = await verifyToken(req, true); // requireAdmin = true
    } catch (err) {
      if (err.message === "ACCESS_TOKEN_EXPIRED") {
        return res.status(401).json({ message: "Access token expired. Please refresh your token." });
      }
      return res.status(401).json({ message: err.message });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { commentId } = body;

    if (!commentId || commentId.length !== 24) return res.status(400).json({ message: "Invalid commentId" });

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const result = await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { approved: true } }
    );

    if (result.modifiedCount === 0) return res.status(404).json({ message: "Comment not found or already approved" });

    res.status(200).json({ message: "Comment approved" });
  } catch (err) {
    console.error("❌ Approve Comment Error:", err.message);
    res.status(500).json({ message: "Server error while approving comment" });
  }
};

