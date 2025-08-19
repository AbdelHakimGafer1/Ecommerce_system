const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  const user = await verifyToken(req, res);
  if (!user) return;

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Only PATCH method allowed" });
  }

  try {
    const { commentId, comment } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!commentId || !comment) {
      return res
        .status(400)
        .json({ message: "Missing commentId or updated comment text" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const existingComment = await db
      .collection("comments")
      .findOne({ _id: new ObjectId(commentId) });

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Allow only owner or admin to edit
    if (
      existingComment.userId.toString() !== user.id &&
      user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this comment" });
    }

    await db.collection("comments").updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          comment,
          approved: false, // re-approval needed after edit
          editedAt: new Date(),
        },
      }
    );

    return res.status(200).json({ message: "Comment updated and pending re-approval" });
  } catch (err) {
    console.error("Edit Comment Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

