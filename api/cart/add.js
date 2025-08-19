const connectToDatabase = require("../../utils/db");
const { verifyToken } = require("../../utils/auth");
const logEvent = require("../../utils/logger");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  const user = await verifyToken(req, res);
  if (!user) return;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST method allowed" });
  }

  try {
    const { productId, quantity } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Missing productId or quantity" });
    }

    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const cart = await db.collection("cart").findOne({ userId: user.id });

    if (cart && Array.isArray(cart.items)) {
      const exists = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (exists) {
        // ✅ المنتج موجود → زود الكمية
        await db.collection("cart").updateOne(
          { userId: user.id, "items.productId": new ObjectId(productId) },
          { $inc: { "items.$.quantity": parseInt(quantity) } }
        );
      } else {
        // ➕ المنتج مش موجود → ضيفه
        await db.collection("cart").updateOne(
          { userId: user.id },
          {
            $push: {
              items: {
                productId: new ObjectId(productId),
                quantity: parseInt(quantity),
              },
            },
          }
        );
      }
    } else {
      // 🧾 السلة مش موجودة أو مفيهاش items → أنشئ جديدة أو عدلها بالكامل
      await db.collection("cart").updateOne(
        { userId: user.id },
        {
          $set: {
            items: [
              {
                productId: new ObjectId(productId),
                quantity: parseInt(quantity),
              },
            ],
          },
        },
        { upsert: true } // 🔁 أنشئ لو مش موجودة
      );
    }

    await logEvent({
      action: "cart_add",
      user: user.email,
      meta: { productId }
    });

    res.status(200).json({ message: "Added to cart successfully" });
  } catch (err) {
    console.error("❌ AddToCart Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

