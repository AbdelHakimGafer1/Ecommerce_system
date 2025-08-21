const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ message: "Only POST allowed" });

  let user;
  try {
    user = await verifyToken(req);
  } catch (err) {
    if (err.message === "ACCESS_TOKEN_EXPIRED") return res.status(401).json({ message: "Access token expired. Please refresh your token." });
    return res.status(401).json({ message: err.message });
  }

  try {
    const { commentId, reason } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!commentId || !reason) return res.status(400).json({ message: "Missing commentId or reason" });

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    // التحقق من وجود تقرير سابق لنفس المستخدم
    const existingReport = await db.collection("reports").findOne({
      commentId: new ObjectId(commentId),
      userId: new ObjectId(user.id),
    });
    if (existingReport) return res.status(400).json({ message: "You already reported this comment" });

    await db.collection("reports").insertOne({
      commentId: new ObjectId(commentId),
      userId: new ObjectId(user.id),
      reason,
      reportedAt: new Date(),
    });

    res.status(200).json({ message: "Report submitted" });
  } catch (err) {
    console.error("❌ Report Comment Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

