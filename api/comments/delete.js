const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  const user = await verifyToken(req, res);
  if (!user) return;

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Only DELETE allowed" });
  }

  const { commentId } = req.query;

  if (!commentId) {
    return res.status(400).json({ message: "Missing commentId" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const comment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // ✅ Allow admin or comment owner
    if (
      comment.userId.toString() !== user.id &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    await db.collection("comments").deleteOne({ _id: new ObjectId(commentId) });

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete Comment Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

