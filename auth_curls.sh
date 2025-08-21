#!/bin/bash

# ========= Config =========
BASE_URL="http://localhost:3000/api/auth"
EMAIL="haki654m@example.com"
PASSWORD="StrongPass123"
NEW_PASSWORD="NewStrongPass123"

# ✅ Login token (من اللوج عندك)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTRjYmMzOWJhNzkwZTI2Y2Q0MTdkYSIsImVtYWlsIjoiaGFraTY1NG1AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciIsInVzZXJuYW1lIjoiaGFraW0iLCJpYXQiOjE3NTU2MzA2MDEsImV4cCI6MTc1NjIzNTQwMX0.UGD6xWQrSH3S8-AEiFINmIMa6AFv6lOEgn2PefzOQik"

# ✅ Reset token (من اللينك بتاع reset-password اللي ظهر في اللوج)
RESET_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YTRjYmMzOWJhNzkwZTI2Y2Q0MTdkYSIsImVtYWlsIjoiaGFraTY1NG1AZXhhbXBsZS5jb20iLCJpYXQiOjE3NTU2MzIyNTUsImV4cCI6MTc1NTYzMzE1NX0.wTUehnxGMDPx2RhCOtESfTLlodpPYBhlOn-jGa0jyC0"

# ========= Commands =========

# Register
echo "➡️ Register"
curl -X POST $BASE_URL/register \
  -H "Content-Type: application/json" \
  -d '{"username":"hakim","email":"'$EMAIL'","password":"'$PASSWORD'"}'
echo -e "\n-------------------------\n"

# Login
echo "➡️ Login"
curl -X POST $BASE_URL/login \
  -H "Content-Type: application/json" \
  -d '{"email":"'$EMAIL'","password":"'$PASSWORD'"}'
echo -e "\n-------------------------\n"

# Logout
echo "➡️ Logout"
curl -X POST $BASE_URL/logout \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n-------------------------\n"

# Forgot Password
echo "➡️ Forgot Password"
curl -X POST $BASE_URL/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"'$EMAIL'"}'
echo -e "\n-------------------------\n"

# Reset Password
echo "➡️ Reset Password"
curl -X POST "$BASE_URL/reset-password?token=$RESET_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"password":"'$NEW_PASSWORD'"}'
echo -e "\n-------------------------\n"

