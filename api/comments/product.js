const connectToDatabase = require("../../utils/db");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET allowed" });
  }

  try {
    const { productId } = req.query;

    if (!productId || productId.length !== 24) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const comments = await db
      .collection("comments")
      .find({ productId: new ObjectId(productId), approved: true })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({ comments });
  } catch (err) {
    console.error("❌ Get Product Comments Error:", err.message);
    res.status(500).json({ message: "Server error while fetching comments" });
  }
};

