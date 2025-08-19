const connectToDatabase = require("../../utils/db");
const{ verifyToken }= require("../../utils/auth");
const logEvent = require("../../utils/logger");

module.exports = async (req, res) => {
  const allowed = await verifyToken(req, res, true); // true = Admin فقط
  if (!allowed) return;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const {
      title,
      description,
      price,
      discountPercentage,
      rating,
      brand,
      category,
      images,
      stock,
      shipping,
      warranty,
      colors,
      sizes,
      tags
    } = body;

    // ✅ تحقق أساسي
    if (!title || !price || !category || !stock) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const now = new Date();

    const newProduct = {
      title,
      description: description || "",
      price: parseFloat(price),
      discountPercentage: parseInt(discountPercentage) || 0,
      rating: parseFloat(rating) || 0,
      brand: brand || "Unknown",
      category,
      images: Array.isArray(images) ? images : [],
      stock: parseInt(stock),
      shipping: {
        free: shipping?.free || false,
        estimatedDays: shipping?.estimatedDays || 5,
        cost: shipping?.cost || 0
      },
      warranty: warranty || "No warranty",
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      tags: Array.isArray(tags) ? tags : [],
      createdAt: now,
      updatedAt: now
    };

    const result = await db.collection("products").insertOne(newProduct);

    await logEvent({
      action: "product_added",
      user: req.user?.email || "unknown",
      meta: { productId: result.insertedId }
    });

    res.status(201).json({
      message: "Product added successfully",
      product: { ...newProduct, _id: result.insertedId }
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error.message);
    await logEvent({
      action: "product_add_failed",
      user: req.user?.email || "unknown",
      meta: { error: error.message }
    });
    res.status(500).json({ message: "Server error while adding product" });
  }
};

