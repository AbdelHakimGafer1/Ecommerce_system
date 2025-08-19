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
    const { commentId, reason } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!commentId || !reason) {
      return res.status(400).json({ message: "Missing commentId or reason" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const existingReport = await db.collection("reports").findOne({
      commentId: new ObjectId(commentId),
      userId: new ObjectId(user.id),
    });

    if (existingReport) {
      return res.status(400).json({ message: "You already reported this comment" });
    }

    await db.collection("reports").insertOne({
      commentId: new ObjectId(commentId),
      userId: new ObjectId(user.id),
      reason,
      reportedAt: new Date(),
    });

    return res.status(200).json({ message: "Report submitted" });
  } catch (err) {
    console.error("Report Comment Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

