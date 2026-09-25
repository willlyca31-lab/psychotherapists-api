const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const swaggerUi = require("swagger-ui-express");

const { connectDatabase } = require("./db/connect");

// Load environment variables
dotenv.config();

// Load the configured passport instance (GitHub OAuth strategy)
const passport = require("./config/passport");

const psychotherapistRoutes = require("./routes/psychotherapists");
const appointmentRoutes = require("./routes/appointments");
const authRoutes = require("./routes/auth");

const swaggerDocument = require("./swagger.json");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// Allows the API to receive JSON data
app.use(express.json());

// Allow cross-origin requests (needed when calling the API from a browser/Swagger UI)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true
  })
);

// Sessions are required for Passport's OAuth login state
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  })
);

// Initialize Passport and let it use the session above
app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// OAuth (GitHub) login/logout routes
app.use("/auth", authRoutes);

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
