const connectToDatabase = require("../../utils/db");
const logEvent = require("../../utils/logger");
const { verifyToken } = require("../../utils/auth");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET method allowed" });
  }

  let username = "guest";
  try {
    const user = await verifyToken(req); 
    username = user?.email || "guest";
  } catch {}

  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Search query is required" });

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const products = await db
      .collection("products")
      .find({
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
          { brand: { $regex: q, $options: "i" } },
          { category: { $regex: q, $options: "i" } },
          { tags: { $elemMatch: { $regex: q, $options: "i" } } }
        ]
      })
      .toArray();

    await logEvent({ action: "product_search", user: username, meta: { query: q } });

    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Product Search Error:", err.message);
    res.status(500).json({ message: "Server error during search" });
  }
};

