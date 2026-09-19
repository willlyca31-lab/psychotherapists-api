const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");

// Load environment variables from .env
dotenv.config();

async function importAppointments() {
  // Create MongoDB connection
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    // Select database
    const db = client.db(process.env.DATABASE_NAME);

    // Select appointments collection
    const collection = db.collection("appointments");

    // Find the JSON data file
    const filePath = path.join(
      __dirname,
      "data",
      "appointments.json"
    );

    // Read and convert the JSON file
    const data = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    // Remove existing records before importing
    // This prevents duplicate records when running the script again.
    await collection.deleteMany({});

    // Insert appointments into MongoDB
    if (data.length > 0) {
      await collection.insertMany(data);
    }

    console.log(`Imported ${data.length} appointments successfully.`);
  } catch (error) {
    console.error("Import failed:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

// Run the import function
importAppointments();