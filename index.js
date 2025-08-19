const connectToDatabase = require("../../utils/db");
const logEvent = require("../../utils/logger");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET allowed" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const products = await db.collection("products").find().toArray();

    await logEvent({
      action: "products_fetched",
      user: req.user?.email || "guest",
      meta: { count: products.length }
    });

    res.status(200).json({ products });
  } catch (error) {
    console.error("❌ Fetch Products Error:", error.message);
    await logEvent({
      action: "products_fetch_failed",
      user: req.user?.email || "guest",
      meta: { error: error.message }
    });
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

