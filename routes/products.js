const express = require("express");
const productRoutes = express.Router();
const Product = require("../models/product");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { validateProduct } = require("../middleware/validate");

// // Create a new product w/ image upload (admin only)
productRoutes.post(
  "/",
  auth,
  role("admin"),
  upload.single("image"),
  validateProduct,
  async (req, res) => {
    if (!req.file) {
      console.error("File not uploaded");
      return res.status(400).json({ error: "File upload failed" });
    }

    try {
      const { name, description, price, category, stock } = req.body;
      const imageUrl = req.file.path; //? `/uploads/${req.file.filename}` : "";

      const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        imageUrl,
      });

      //save to database
      await product.save();

      res.status(201).json(product);
    } catch (error) {
      console.error("Error adding new product: ", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all products with pagination and filter by category
productRoutes.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sortBy,
      sortOrder = "asc",
    } = req.query;

    //filter based on the category (if provided)
    const filter = category ? { category } : {};

    //sort based on the sortBy and sortOrder (if provided)
    const sort = sortBy ? { [sortBy]: sortOrder === "asc" ? 1 : -1 } : {};

    // Query the database to get products with filters, sorting, and pagination
    const products = await Product.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    // Send the total count and the retrieved products as a response
    const total = await Product.countDocuments(filter);

    res.json({ total, products });
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
productRoutes.put(
  "/:id",
  auth,
  role("admin"),
  upload.single("image"),
  validateProduct,
  async (req, res) => {
    try {
      const { name, description, price, category, stock } = req.body;
      const productId = req.params.id;

      // Check if the product exists
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Update image URL only if a new file is provided, otherwise keep the old one
      let imageUrl = existingProduct.imageUrl;
      if (req.file && req.file.path) {
        imageUrl = req.file.path;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          name: name || existingProduct.name,
          description: description || existingProduct.description,
          price: price || existingProduct.price,
          category: category || existingProduct.category,
          stock: stock || existingProduct.stock,
          imageUrl,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      // if (!product) {
      //   return res.status(404).json({ error: "Product not found" });
      // }

      // const imageUrl = req.file.path
      //   ? `/uploads/${req.file.filename}`
      //   : req.body.imageUrl;

      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product: ", error);
      res.status(400).json({ error: error.message });
    }
  }
);

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
