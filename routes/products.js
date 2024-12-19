const Router = require("express").Router;
const productRoutes = Router();
const Product = require("../models/product");

// Create a new product
productRoutes.post("/", async (req, res) => {
  const data = req.body;
  try {
    const newProduct = new Product({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
    });

    //save to database
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding new product: ", error);
    res.status(400).json({ error: error.message });
  }
});

// Get all products or filter by category
productRoutes.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("Error retrieving all products: ", error);
    res.status(500).json({ error: error.message });
  }
});

//Get a single product by ID
productRoutes.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product: ", error);
    res.status(500).json({ error: error.message });
  }
});

//Update a product by ID
productRoutes.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error updating product: ", error);
    res.status(400).json({ error: error.message });
  }
});

//Delete a product by ID
productRoutes.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error("Error deleting product: ", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = productRoutes;
