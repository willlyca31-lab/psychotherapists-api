const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

// Load environment variables from .env
dotenv.config();

async function importPsychotherapists() {
  // Create MongoDB connection
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // Select database
    const db = client.db(process.env.DATABASE_NAME);

    // Select collection
    const collection = db.collection("psychotherapists");

    // Find the JSON data file
    const filePath = path.join(
      __dirname,
      "data",
      "psychotherapists.json"
    );

    // Read and convert the JSON file
    const data = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    // Remove existing records before importing
    // This prevents duplicate records if you run the script again.
    await collection.deleteMany({});

    // Insert the psychotherapists into MongoDB
    if (data.length > 0) {
      await collection.insertMany(data);
    }

    console.log(`Imported ${data.length} psychotherapists successfully.`);
  } catch (error) {
    console.error("Import failed:", error);
  } finally {
    // Close the MongoDB connection
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

// Run the import function
importPsychotherapists();