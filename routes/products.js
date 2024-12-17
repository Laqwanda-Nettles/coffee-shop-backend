const Router = require("express").Router;
const productRoutes = Router();

// Get all products
productRoutes.get("/", (req, res) => {
  res.json({
    message: "Get all products",
  });
});

// Create a new product
productRoutes.post("/", (req, res) => {
  res.json({ message: "Added a new product" });
});

//Get a single product by ID
productRoutes.get("/:id", (req, res) => {
  res.json({ message: "Get product by ID" });
});

//Update a product by ID
productRoutes.put("/:id", (req, res) => {
  res.json({
    message: "Updated product",
  });
});

//Delete a product by ID
productRoutes.delete("/:id", (req, res) => {
  res.json({ message: "Deleted product" });
});

module.exports = productRoutes;
