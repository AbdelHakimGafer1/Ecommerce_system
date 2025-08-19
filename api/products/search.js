const connectToDatabase = require("../../utils/db");
const logEvent = require("../../utils/logger");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET method allowed" });
  }

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
          { tags: { $in: [q] } }
        ]
      })
      .toArray();

    await logEvent({ action: "product_search", user: "guest", meta: { q } });

    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Product Search Error:", err.message);
    res.status(500).json({ message: "Server error during search" });
  }
};

