const connectToDatabase = require("../../utils/db");
const logEvent = require("../../utils/logger");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET method allowed" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    // قراءة query parameters
    const {
      q,
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      brand,
      category,
      inStock,
      tags
    } = req.query;

    const filters = {};

    // فلترة البحث
    if (q) {
      filters.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { tags: { $in: [q] } }
      ];
    }

    // فلترة حسب السعر
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // فلترة حسب التقييم
    if (minRating || maxRating) {
      filters.rating = {};
      if (minRating) filters.rating.$gte = parseFloat(minRating);
      if (maxRating) filters.rating.$lte = parseFloat(maxRating);
    }

    // فلترة حسب stock
    if (inStock === "true") {
      filters.stock = { $gt: 0 };
    }

    // فلترة حسب brand أو category
    if (brand) filters.brand = brand;
    if (category) filters.category = category;

    // فلترة حسب tags (array أو comma-separated)
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(",");
      filters.tags = { $in: tagsArray.map(tag => tag.trim()) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await db
      .collection("products")
      .find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    await logEvent({
      action: "products_fetched",
      user: "guest",
      ip: req.headers["x-forwarded-for"] || req.connection?.remoteAddress
    });

    res.status(200).json({ 
      page: parseInt(page),
      limit: parseInt(limit),
      results: products.length,
      products
    });
  } catch (error) {
    console.error("❌ Get Products Error:", error.message);
    res.status(500).json({ message: "Server error while fetching products" });
  }
};

