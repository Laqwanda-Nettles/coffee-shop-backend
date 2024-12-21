const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const auth = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//auth routes
app.use("/auth", authRoutes);

//Protected products route
app.use("/products", auth, productRoutes);

//users route
app.use("/users", auth, userRoutes);

//error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
