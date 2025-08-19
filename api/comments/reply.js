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
    const { parentCommentId, reply } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!parentCommentId || !reply) {
      return res.status(400).json({ message: "Missing parentCommentId or reply" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const parentComment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(parentCommentId) });

    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    await db.collection("comments").insertOne({
      userId: new ObjectId(user.id),
      productId: parentComment.productId,
      parentCommentId: new ObjectId(parentCommentId),
      comment: reply,
      approved: false,
      isReply: true,
      createdAt: new Date(),
    });

    return res.status(200).json({ message: "Reply submitted for approval" });
  } catch (err) {
    console.error("Reply Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

