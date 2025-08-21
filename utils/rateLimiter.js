const rateLimitStore = new Map(); // تخزين مؤقت في الذاكرة

const RATE_LIMIT_WINDOW = 60 * 1000; // نافذة زمنية: 1 دقيقة
const MAX_REQUESTS = 5; // أقصى عدد طلبات خلال الدقيقة

function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

module.exports = async function rateLimiter(req, res) {
  const ip = getClientIP(req);
  const now = Date.now();

  const record = rateLimitStore.get(ip) || {
    count: 0,
    lastRequestTime: now
  };

  if (now - record.lastRequestTime > RATE_LIMIT_WINDOW) {
    record.count = 1;
    record.lastRequestTime = now;
  } else {
    record.count += 1;
  }

  rateLimitStore.set(ip, record);

  if (record.count > MAX_REQUESTS) {
    res.status(429).json({ message: "Too many requests. Please slow down." });
    return false;
  }

  return true;
};

