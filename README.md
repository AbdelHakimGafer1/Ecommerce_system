<h1 align="center">🛒 E-Commerce REST API</h1>

<p align="center">
  <b>Welcome, Developer!</b> 🎉<br/>
  Build your next-level e-commerce backend with <strong>security</strong>, <strong>speed</strong>, and <strong>scalability</strong>!  
</p>

<p align="center">
  ⚡ Fast • 🔐 Secure • 🧩 Modular • ☁️ Serverless • 💬 Comment-ready
</p>

---

<p align="center">
  👋 If this project helps you, please consider <b>starring ⭐ the repo</b>.<br/>
  It means the world and helps us grow! 🙏
</p>

<p align="center">
  🔒 <strong>This repository is PRIVATE</strong><br/>
  But you're lucky! You're getting an exclusive early-access preview.  
</p>

<p align="center">
  💰 <strong>Want full access?</strong><br/>
  Premium APIs like 🛍 Orders, 📈 Admin Analytics, 🛡️ 2FA, and 🔔 Notifications<br/>
  are available in the <b>Private Pro Plan</b>. Contact the author to unlock it!
</p>

---

## 📊 System Overview

```
+-------------+         +--------------+     
|   [User]    | ----->  |  Auth API    |     
+-------------+         +--------------+     
      |                          |            
      |                          v            
      |                 +----------------+    
      |                 |   JWT Token    |    
      |                 +----------------+    
      |                          |            
      v                          v            
+----------------+     +------------------+   
| Products API   |<--> |   Reviews API    |   
+----------------+     +------------------+   
      |                          
      v                          
+----------------+               
|   Cart API     |               
+----------------+               
      |                          
      v                          
+----------------+               
| Comments API   |               
+----------------+               

+-------------+                                 
|   [Admin]   | -----------------------------+  
+-------------+                              |  
                                             v  
                                  +---------------------+  
                                  |  Admin Endpoints     |  
                                  +---------------------+  
```

---

## 🔐 Authentication Endpoints

| Method | Endpoint                     | Description                     |
|--------|------------------------------|---------------------------------|
| POST   | `/api/auth/register`        | Register new user               |
| POST   | `/api/auth/login`           | Login and get JWT token         |
| POST   | `/api/auth/logout`          | Logout and invalidate session   |
| POST   | `/api/auth/forgot-password` | Send reset token to email       |
| POST   | `/api/auth/reset-password`  | Reset password using token      |

---

## 🛍️ Product Endpoints

| Method | Endpoint                    | Description                     |
|--------|-----------------------------|---------------------------------|
| GET    | `/api/products`            | Get all products                |
| GET    | `/api/products/:id`        | Get product by ID               |
| POST   | `/api/products/add`        | Add new product *(admin)*       |
| PUT    | `/api/products/edit`       | Edit product *(admin)*          |
| DELETE | `/api/products/delete`     | Delete product *(admin)*        |
| GET    | `/api/products/search`     | Search products by keyword      |
| POST   | `/api/products/rate`       | Rate a product *(user)*         |

---

## 🛒 Cart Endpoints

| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| GET    | `/api/cart`            | Get current user's cart         |
| POST   | `/api/cart/add`        | Add product to cart             |
| PUT    | `/api/cart/update`     | Update quantity of product      |
| DELETE | `/api/cart/remove/:id` | Remove specific item from cart  |
| DELETE | `/api/cart/clear`      | Clear all items in the cart     |

---

## 💬 Comments Endpoints

| Method | Endpoint                   | Description                     |
|--------|----------------------------|---------------------------------|
| POST   | `/api/comments/add`        | Add comment *(user)*            |
| GET    | `/api/comments/product`    | Get product comments            |
| GET    | `/api/comments/all`        | Get all comments *(admin)*      |
| PUT    | `/api/comments/approve`    | Approve comment *(admin)*       |
| DELETE | `/api/comments/delete`     | Delete comment *(user/admin)*   |
| PUT    | `/api/comments/edit`       | Edit comment *(user)*           |
| POST   | `/api/comments/report`     | Report inappropriate comment    |
| POST   | `/api/comments/reply`      | Reply to a comment *(user)*     |

---

## ⭐ Reviews Endpoints

| Method | Endpoint                  | Description                    |
|--------|---------------------------|--------------------------------|
| POST   | `/api/reviews/add`        | Submit a product review        |
| GET    | `/api/reviews/:productId` | Get all reviews for product    |
| DELETE | `/api/reviews/delete/:id` | Delete review *(user/admin)*   |

---

## 📦 Project Structure

```
/api
  /auth
  /products
  /cart
  /comments
  /reviews
/middleware
/utils
```

---

## 🔒 Security

- Argon2 password hashing  
- JWT Auth with roles  
- Login attempt limits  
- IP logging + agent  
- Rate limit per IP (100 req / 15 min)

---

## 🧪 Example curl

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "hakim@example.com", "password": "StrongPass123"}'
```

---

## 🗺️ Roadmap

| Feature             | Status     |
|---------------------|------------|
| 🛒 Orders API        | 🔜 Premium |
| 📊 Admin Dashboard   | 🔜 Premium |
| 🧾 Invoices & Receipts | 🔜 Premium |
| 🔔 Notifications     | 🔜 Premium |
| 🧑‍💼 Team Collaboration | 🔜 Premium |

---

## 👨‍💻 Author

**Abdel Hakim Gafer**  
Participant in **Areeb Tech Challenge 2025**  
GitHub: [@abdelhakimgafer1](https://github.com/abdelhakimgafer1)

---

> ✅ Like it? Star it. Want more? Ask for the Pro version!
