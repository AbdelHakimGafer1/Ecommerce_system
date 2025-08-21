### بيانات المستخدم (من الـ login)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTRjYmMzOWJhNzkwZTI2Y2Q0MTdkYSIsImVtYWlsIjoiaGFraTY1NG1AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsInVzZXJuYW1lIjoiaGFraW0iLCJpYXQiOjE3NTU2MzA2MDEsImV4cCI6MTc1NjIzNTQwMX0.UGD6xWQrSH3S8-AEiFINmIMa6AFv6lOEgn2PefzOQik"
USER_EMAIL="haki654m@example.com"
USERNAME="hakim"
PRODUCT_ID="68a508942c2679e819e9aa02"

### 1️⃣ Add Comment (User)
curl -X POST http://localhost:3000/api/comments/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":"'$PRODUCT_ID'","comment":"Great product!"}'

### 2️⃣ Get Product Comments
curl -X GET "http://localhost:3000/api/comments/product?productId=$PRODUCT_ID"

### 3️⃣ Get All Comments (Admin)
curl -X GET http://localhost:3000/api/comments/all \
  -H "Authorization: Bearer $TOKEN"

### 4️⃣ Approve Comment (Admin)
curl -X PUT http://localhost:3000/api/comments/approve/<COMMENT_ID> \
  -H "Authorization: Bearer $TOKEN"

### 5️⃣ Delete Comment (User/Admin)
curl -X DELETE "http://localhost:3000/api/comments/delete?commentId=<COMMENT_ID>" \
  -H "Authorization: Bearer $TOKEN"

### 6️⃣ Edit Comment (User)
curl -X PUT http://localhost:3000/api/comments/edit/<COMMENT_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"comment":"Updated comment text"}'

### 7️⃣ Report Inappropriate Comment
curl -X POST http://localhost:3000/api/comments/report \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"commentId":"<COMMENT_ID>","reason":"Inappropriate language"}'

### 8️⃣ Reply to a Comment (User)
curl -X POST http://localhost:3000/api/comments/reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"commentId":"<COMMENT_ID>","reply":"Thanks for your feedback!"}'

