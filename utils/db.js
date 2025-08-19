const { MongoClient } = require("mongodb");

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("❌ MONGODB_URI is missing");

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = connectToDatabase;

