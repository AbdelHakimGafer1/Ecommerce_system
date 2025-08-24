<h1 align="center">🛒 E-Commerce system</h1>

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


# Frontend Setup Guide for `Ecommerce_system` API

## 1️⃣ تشغيل المشروع محليًا (Development)
- **مطلوب:** تثبيت [Vercel CLI](https://vercel.com/docs/cli)

npm install -g vercel


* بعد كده:

```bash
# استنساخ المشروع
git clone git@github.com:AbdelHakimGafer1/Ecommerce_system.git
cd Ecommerce_system

# تثبيت الحزم
npm install

# تشغيل السيرفر محليًا
vercel dev
```

* السيرفر المحلي هيشتغل عادة على:

```
http://localhost:3000
```

* كل الـ Serverless Endpoints هتكون متاحة على نفس الـ URL.


## 3️⃣ ملاحظات مهمة

* أي تعديل على Serverless Functions أثناء `vercel dev` بيتفعل تلقائي بعد الحفظ.
* تأكد من استخدام نفس الـ endpoints سواء محلي أو نسخة منشورة.
* لو فيه endpoints محمية بـ JWT، لازم الـ frontend يضيف التوكن في الـ headers عند عمل أي request.

```

---


```

# 🛒 E-Commerce REST API Documentation

This is a complete documentation of the **E-Commerce REST API**, including all endpoints, request methods, authentication requirements, and example `curl` commands.

---

## **1️⃣ Authentication**

| Endpoint | Method | Auth | Description | Example `curl` |
|----------|--------|------|-------------|----------------|
| `/api/auth/register` | POST | No | Register a new user | ```bash curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"username":"hakim2","email":"hakim2@example12.com","password":"StrongPass123"}'``` |
| `/api/auth/login` | POST | No | Login and get `accessToken` & `refreshToken` | ```bash curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"hakim2@example12.com","password":"StrongPass123"}'``` |
| `/api/auth/logout` | POST | Yes | Logout user using token | ```bash curl -X POST http://localhost:3000/api/auth/logout -H "Authorization: Bearer <TOKEN>"``` |
| `/api/auth/forgot-password` | POST | No | Request password reset code | ```bash curl -X POST http://localhost:3000/api/auth/forgot-password -H "Content-Type: application/json" -d '{"email":"hakim2@example12.com"}'``` |
| `/api/auth/reset-password` | POST | No | Reset password using code | ```bash curl -X POST http://localhost:3000/api/auth/reset-password -H "Content-Type: application/json" -d '{"email":"hakim2@example12.com","code":"RESET_CODE","newPassword":"NewStrongPass123"}'``` |
| `/api/auth/refresh-token` | POST | Yes | Get new accessToken using refreshToken | ```bash curl -X POST http://localhost:3000/api/auth/refresh-token -H "Content-Type: application/json" -H "Authorization: Bearer <REFRESH_TOKEN>"``` |

---

## **2️⃣ Products**

| Endpoint | Method | Auth | Description | Example `curl` |
|----------|--------|------|-------------|----------------|
| `/api/products/add` | POST | Admin | Add a new product | ```bash curl -X POST http://localhost:3000/api/products/add -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"title":"Phone X","description":"Latest generation","price":699.99,"stock":10,"brand":"BrandX","category":"electronics","images":["url1","url2"]}'``` |
| `/api/products` | GET | No | Get all products | ```bash curl -X GET http://localhost:3000/api/products``` |
| `/api/products/<PRODUCT_ID>` | GET | No | Get single product by ID | ```bash curl -X GET http://localhost:3000/api/products/<PRODUCT_ID>``` |
| `/api/products/edit` | PUT | Admin | Edit product details | ```bash curl -X PUT http://localhost:3000/api/products/<PRODUCT_ID> -H "Content-Type: application/json" -H "Authorization: Bearer <ADMIN_TOKEN>" -d '{"price":749.99,"stock":15}'``` |
| `/api/products/delete` | DELETE | Admin | Delete a product | ```bash curl -X DELETE http://localhost:3000/api/products/<PRODUCT_ID> -H "Authorization: Bearer <ADMIN_TOKEN>"``` |
| `/api/products/search` | GET | No | Search products by query | ```bash curl -X GET "http://localhost:3000/api/products/search?q=Phone"``` |

---

## **3️⃣ Cart**

| Endpoint | Method | Auth | Description | Example `curl` |
|----------|--------|------|-------------|----------------|
| `/api/cart/add` | POST | Yes | Add item to cart | ```bash curl -X POST http://localhost:3000/api/cart/add -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"productId":"<PRODUCT_ID>","quantity":2}'``` |
| `/api/cart` | GET | Yes | Get current cart | ```bash curl -X GET http://localhost:3000/api/cart -H "Authorization: Bearer <TOKEN>"``` |
| `/api/cart/update` | PUT | Yes | Update item quantity | ```bash curl -X PUT http://localhost:3000/api/cart/update -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"productId":"<PRODUCT_ID>","quantity":3}'``` |
| `/api/cart/remove/<PRODUCT_ID>` | DELETE | Yes | Remove item from cart | ```bash curl -X DELETE http://localhost:3000/api/cart/remove/<PRODUCT_ID> -H "Authorization: Bearer <TOKEN>"``` |
| `/api/cart/clear` | DELETE | Yes | Clear all items | ```bash curl -X DELETE http://localhost:3000/api/cart/clear -H "Authorization: Bearer <TOKEN>"``` |

---

## **4️⃣ Comments**

| Endpoint | Method | Auth | Description | Example `curl` |
|----------|--------|------|-------------|----------------|
| `/api/comments/add` | POST | Yes | Add comment to product | ```bash curl -X POST http://localhost:3000/api/comments/add -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"productId":"<PRODUCT_ID>","comment":"Great product!"}'``` |
| `/api/comments/product` | GET | No | Get all approved comments for product | ```bash curl -X GET http://localhost:3000/api/comments/product?productId=<PRODUCT_ID>``` |
| `/api/comments/all` | GET | Admin | Get all comments | ```bash curl -X GET http://localhost:3000/api/comments/all -H "Authorization: Bearer <ADMIN_TOKEN>"``` |
| `/api/comments/approve` | PUT | Admin | Approve comment | ```bash curl -X PUT http://localhost:3000/api/comments/approve/<COMMENT_ID> -H "Authorization: Bearer <ADMIN_TOKEN>"``` |
| `/api/comments/edit` | PATCH | Yes | Edit own comment | ```bash curl -X PATCH http://localhost:3000/api/comments/edit -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"commentId":"<COMMENT_ID>","comment":"Updated comment text"}'``` |
| `/api/comments/delete` | DELETE | Yes | Delete own comment | ```bash curl -X DELETE "http://localhost:3000/api/comments/delete?commentId=<COMMENT_ID>" -H "Authorization: Bearer <TOKEN>"``` |
| `/api/comments/report` | POST | Yes | Report a comment | ```bash curl -X POST http://localhost:3000/api/comments/report -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"commentId":"<COMMENT_ID>","reason":"Spam"}'``` |
| `/api/comments/reply` | POST | Yes | Reply to a comment | ```bash curl -X POST http://localhost:3000/api/comments/reply -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"parentCommentId":"<COMMENT_ID>","reply":"Thanks for your feedback!"}'``` |

---

## **5️⃣ Reviews**

| Endpoint | Method | Auth | Description | Example `curl` |
|----------|--------|------|-------------|----------------|
| `/api/reviews/add` | POST | Yes | Add review to product | ```bash curl -X POST http://localhost:3000/api/reviews/add -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN>" -d '{"productId":"<PRODUCT_ID>","rating":5,"review":"Excellent!"}'``` |
| `/api/reviews/<PRODUCT_ID>` | GET | No | Get reviews for a product | ```bash curl -X GET http://localhost:3000/api/reviews/<PRODUCT_ID>``` |
| `/api/reviews/delete/<REVIEW_ID>` | DELETE | Yes | Delete review | ```bash curl -X DELETE http://localhost:3000/api/reviews/delete/<REVIEW_ID> -H "Authorization: Bearer <TOKEN>"``` |

---

## **6️⃣ Notes**

1. Replace `<TOKEN>` and `<ADMIN_TOKEN>` with the actual JWT tokens.
2. Replace `<PRODUCT_ID>`, `<COMMENT_ID>`, and `<REVIEW_ID>` with actual IDs from database.
3. Admin-only actions require `role: admin` in the JWT payload.
4. Access Tokens expire after 15 minutes; use Refresh Token endpoint to renew.
5. All POST/PUT/PATCH requests require `Content-Type: application/json`.

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

## 1️⃣ Authentication

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "hakim2", "email": "hakim2@example12.com", "password": "StrongPass123"}'
````

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hakim2@example12.com", "password":"StrongPass123"}'
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <TOKEN>"
```


---



## 🔑 Authentication
All requests must include a valid **Bearer Token** in the `Authorization` header.

Example:
```http
Authorization: Bearer <your_admin_access_token>
````

---

## 📋 Endpoints

### 1️⃣ List All Users

**GET** `/api/admin/list-users`

Returns a list of all users.

#### Curl Example

```bash
curl -X GET http://localhost:3000/api/admin/list-users \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
```

#### Example Response

```json
[
  {
    "_id": "68a520bd27a4785d22df0e8e",
    "username": "ahmed123",
    "email": "ah77me7766od@example.com",
    "role": "user",
    "createdAt": "2025-06-20T12:11:25.928Z"
  },
  {
    "_id": "68aa792ee041928e1d912b39",
    "username": "hakim2",
    "email": "nhakim2@example12.com",
    "role": "admin",
    "createdAt": "2025-06-25T09:22:00.123Z"
  }
]
```

---

### 2️⃣ Promote User to Admin

**PATCH** `/api/admin/promote-user`

Promote a regular user to **admin**.

#### Request Body

```json
{
  "userId": "<USER_ID>"
}
```

#### Curl Example

```bash
curl -X PATCH http://localhost:3000/api/admin/promote-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d '{
    "userId": "68a520bd27a4785d22df0e8e"
  }'
```

#### Example Response

```json
{
  "message": "User promoted to admin",
  "userId": "68a520bd27a4785d22df0e8e"
}
```

---

### 3️⃣ Demote User (Remove Admin Role)

**PATCH** `/api/admin/demote-user`

Remove admin privileges from a user.

#### Request Body

```json
{
  "userId": "<USER_ID>"
}
```

#### Curl Example

```bash
curl -X PATCH http://localhost:3000/api/admin/demote-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d '{
    "userId": "68a520bd27a4785d22df0e8e"
  }'
```

#### Example Response

```json
{
  "message": "User demoted to regular user",
  "userId": "68a520bd27a4785d22df0e8e"
}
```

---

## 🚀 Notes

* These endpoints are **admin-only**.
* `401 Unauthorized` → If no token or invalid token.
* `403 Forbidden` → If user is not an admin.
* `404 Not Found` → If `userId` does not exist in the database.

---




## 2️⃣ Products

### Add Product (Admin)

```bash
curl -X POST http://localhost:3000/api/products/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"title":"Phone X","description":"Latest generation","price":699.99,"stock":10,"brand":"BrandX","category":"electronics","images":["url1","url2"]}'
```

### Get All Products

```bash
curl -X GET http://localhost:3000/api/products
```

### Get Single Product

```bash
curl -X GET http://localhost:3000/api/products/<PRODUCT_ID>
```

### Update Product (Admin)

```bash
curl -X PUT http://localhost:3000/api/products/<PRODUCT_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"price":749.99, "stock":15}'
```

### Delete Product (Admin)

```bash
curl -X DELETE http://localhost:3000/api/products/<PRODUCT_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 3️⃣ Cart

### Add Item

```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"productId":"<PRODUCT_ID>","quantity":2}'
```

### Get Cart

```bash
curl -X GET http://localhost:3000/api/cart \
  -H "Authorization: Bearer <TOKEN>"
```

### Update Cart

```bash
curl -X PUT http://localhost:3000/api/cart/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"productId":"<PRODUCT_ID>","quantity":3}'
```

### Remove Item

```bash
curl -X DELETE http://localhost:3000/api/cart/remove/<PRODUCT_ID> \
  -H "Authorization: Bearer <TOKEN>"
```

### Clear Cart

```bash
curl -X DELETE http://localhost:3000/api/cart/clear \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 4️⃣ Comments

### Add Comment

```bash
curl -X POST http://localhost:3000/api/comments/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"productId":"<PRODUCT_ID>","comment":"Great product!"}'
```

### Get Comments

```bash
curl -X GET http://localhost:3000/api/comments/<PRODUCT_ID>
```

### Approve Comment (Admin)

```bash
curl -X PUT http://localhost:3000/api/comments/approve/<COMMENT_ID> \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### Delete Comment

```bash
curl -X DELETE "http://localhost:3000/api/comments/delete?commentId=<COMMENT_ID>" \
  -H "Authorization: Bearer <TOKEN>"
```

### Reply to Comment

```bash
curl -X POST http://localhost:3000/api/comments/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"parentCommentId":"<COMMENT_ID>","reply":"Thanks for your feedback!"}'
```

### Report Comment

```bash
curl -X POST http://localhost:3000/api/comments/report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"commentId":"<COMMENT_ID>","reason":"Inappropriate content"}'
```

### Get All Comments (Admin)

```bash
curl -X GET http://localhost:3000/api/comments/all \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 5️⃣ Reviews

### Add Review

```bash
curl -X POST http://localhost:3000/api/reviews/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"productId":"<PRODUCT_ID>","rating":5,"review":"Excellent!"}'
```

### Get Reviews

```bash
curl -X GET http://localhost:3000/api/reviews/<PRODUCT_ID>
```

### Delete Review

```bash
curl -X DELETE http://localhost:3000/api/reviews/delete/<REVIEW_ID> \
  -H "Authorization: Bearer <TOKEN>"


```

```bash
## 🗺️ Roadmap

| Feature             | Status     |
|---------------------|------------|
| 🛒 Orders API        | 🔜 Premium |
| 📊 Admin Dashboard   | 🔜 Premium |
| 🧾 Invoices & Receipts | 🔜 Premium |
| 🔔 Notifications     | 🔜 Premium |
| 🧑‍💼 Team Collaboration | 🔜 Premium |



## 👨‍💻 Author

Abdel Hakim Gafer
Participant in Areeb Tech Challenge 2025
GitHub: [@abdelhakimgafer1](https://github.com/abdelhakimgafer1)



✅ Like it? Star it. Want more? Ask for the Pro version!
```
