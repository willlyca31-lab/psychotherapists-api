const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");

const { connectDatabase } = require("./db/connect");

const psychotherapistRoutes = require("./routes/psychotherapists");
const appointmentRoutes = require("./routes/appointments");

const swaggerDocument = require("./swagger.json");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// Allows the API to receive JSON data
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Swagger API documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Psychotherapists routes
app.use("/psychotherapists", psychotherapistRoutes);

// Appointments routes
app.use("/appointments", appointmentRoutes);

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Swagger: http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the application
startServer();