const { ObjectId } = require("mongodb");
const connectToDatabase = require("../../utils/db");
const logEvent = require("../../utils/logger");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET method allowed" });
  }

  const id = req.url.split("/").pop();

  if (!id || id.length !== 24) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await logEvent({
      action: "product_viewed",
      user: "guest",
      meta: { productId: id },
    });

    res.status(200).json(product);
  } catch (err) {
    console.error("❌ Error getting product:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

