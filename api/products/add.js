const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const logEvent = require("../../utils/logger");

// Rate limiting بسيط لكل مستخدم (تقدر تعدل القيم حسب الحاجة)
const rateLimitWindow = 60000; // 1 دقيقة
const maxRequests = 10;
const rateLimitStore = {};

function checkRateLimit(userId) {
  const now = Date.now();
  if (!rateLimitStore[userId]) rateLimitStore[userId] = [];
  // إزالة أي طلبات قديمة خارج النافذة الزمنية
  rateLimitStore[userId] = rateLimitStore[userId].filter(ts => now - ts < rateLimitWindow);
  if (rateLimitStore[userId].length >= maxRequests) return false;
  rateLimitStore[userId].push(now);
  return true;
}

module.exports = async (req, res) => {
  // حماية Admin + توحيد التعامل مع التوكن
  let user;
  try {
    user = await verifyToken(req, true); // true = Admin فقط
  } catch (err) {
    if (err.message === "ACCESS_TOKEN_EXPIRED") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: err.message });
  }

  // Rate limiting
  if (!checkRateLimit(user.id)) {
    return res.status(429).json({ message: "Too many requests. Try again later." });
  }

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

    // التحقق من الحقول الأساسية
    if (!title || !price || !category || stock == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    if (isNaN(stock) || parseInt(stock) < 0) {
      return res.status(400).json({ message: "Stock must be 0 or more" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const now = new Date();
    const newProduct = {
      title: title.trim(),
      description: description?.trim() || "",
      price: parseFloat(price),
      discountPercentage: parseInt(discountPercentage) || 0,
      rating: parseFloat(rating) || 0,
      brand: brand?.trim() || "Unknown",
      category: category.trim(),
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

    // تسجيل الحدث
    await logEvent({
      action: "product_added",
      user: user.email,
      meta: { productId: result.insertedId }
    });

    return res.status(201).json({
      message: "Product added successfully",
      product: { ...newProduct, _id: result.insertedId }
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error.message);
    await logEvent({
      action: "product_add_failed",
      user: user.email,
      meta: { error: error.message }
    });
    return res.status(500).json({ message: "Server error while adding product" });
  }
};

