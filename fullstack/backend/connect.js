const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

module.exports = {
  connectToServer: async () => {
    try {
      await client.connect();
      database = client.db("blogData");
      console.log("Successfully connected to MongoDB.");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  },
  getDb: () => {
    if (!database) {
      throw new Error("Database not initialized. Call connectToServer first.");
    }
    return database;
  }
}
