const connectToDatabase = require("../utils/db");

module.exports = async (req, res) => {
  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const collections = await db.listCollections().toArray();

    res.status(200).json({
      message: "✅ Connected to MongoDB!",
      collections: collections.map(c => c.name),
    });
  } catch (err) {
    res.status(500).json({
      message: "❌ Failed to connect",
      error: err.message,
    });
  }
};

