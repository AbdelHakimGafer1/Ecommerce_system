const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Only PATCH allowed" });

  let user;
  try {
    user = await verifyToken(req);
  } catch (err) {
    if (err.message === "ACCESS_TOKEN_EXPIRED") return res.status(401).json({ message: "Access token expired. Please refresh your token." });
    return res.status(401).json({ message: err.message });
  }

  try {
    const { commentId, comment } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!commentId || !comment) return res.status(400).json({ message: "Missing commentId or updated comment text" });
    if (commentId.length !== 24) return res.status(400).json({ message: "Invalid commentId" });
    if (comment.length > 500) return res.status(400).json({ message: "Comment too long" });

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const existingComment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });
    if (!existingComment) return res.status(404).json({ message: "Comment not found" });

    if (existingComment.userId.toString() !== user.id && user.role !== "admin")
      return res.status(403).json({ message: "You are not authorized to edit this comment" });

    await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { comment, approved: false, editedAt: new Date() } }
    );

    res.status(200).json({ message: "Comment updated and pending re-approval" });
  } catch (err) {
    console.error("❌ Edit Comment Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

