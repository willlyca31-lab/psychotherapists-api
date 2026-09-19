const { MongoClient } = require("mongodb");

// Store the database connection
let database;

// Connect to MongoDB
async function connectDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();

  database = client.db(process.env.DATABASE_NAME);

  console.log("Connected to MongoDB");
}

// Get the database connection
function getDatabase() {
  if (!database) {
    throw new Error("Database has not been connected.");
  }

  return database;
}

module.exports = {
  connectDatabase,
  getDatabase
};