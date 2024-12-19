const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const auth = require("./middleware/auth");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

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

//products route
//app.use("/products", productRoutes);

//auth routes
app.use("/auth", authRoutes);

//Protected products route
app.use("/products", auth, productRoutes);

//users route
app.use("/users", auth, userRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
