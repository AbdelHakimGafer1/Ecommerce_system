const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ message: "Only GET allowed" });

  let user;
  try {
    user = await verifyToken(req, true); // فقط Admin
  } catch (err) {
    if (err.message === "ACCESS_TOKEN_EXPIRED") return res.status(401).json({ message: "Access token expired. Please refresh your token." });
    return res.status(401).json({ message: err.message });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const comments = await db.collection("comments")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ comments });
  } catch (err) {
    console.error("❌ Get All Comments Error:", err.message);
    res.status(500).json({ message: "Server error while fetching all comments" });
  }
};

