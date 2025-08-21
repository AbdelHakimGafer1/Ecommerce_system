
console.log("📂 Loading authRoutes...");
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./db');

dotenv.config();
const app = express();

connectDB();

const rateLimiter = require('./utils/rateLimiter');
app.use(rateLimiter); // ← كده هيأثر على كل الـ APIs

app.use(helmet());
app.use(cors({ origin: '*' })); // تقدر تغيره لواجهة موقعك فقط
app.use(morgan('dev'));
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: '⚠️ Too many requests. Try again later.',
});
app.use(limiter);

app.get('/', (req, res) => {
  res.send('🚀 E-commerce Secure API is running...');
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
 console.log(`✅ [API] Server running securely on http://localhost:${port}`);

});

