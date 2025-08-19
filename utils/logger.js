const connectToDatabase = require("./db");
const chalk = require("chalk");

async function logEvent({ action, user, ip, userAgent, timestamp, error }) {
  try {
    const client = await connectToDatabase();
    const db = client.db("ecommerce");

    const log = {
      action,
      user: user || "unknown",
      ip: ip || "unknown",
      userAgent: userAgent || "unknown",
      timestamp: timestamp || new Date().toISOString(),
      error: error || null,
    };

    await db.collection("logs").insertOne(log);

    // ✅ ألوان مميزة للـ console
    console.log(
      chalk.blue(`[${log.timestamp}]`) +
      chalk.yellow(` [${log.action}]`) +
      chalk.green(` User: ${log.user}`) +
      chalk.cyan(` IP: ${log.ip}`)
    );
  } catch (e) {
    console.error("❌ Logging to DB failed:", e.message);
  }
}

module.exports = logEvent;

