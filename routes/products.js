const Router = require("express").Router;
const productRoutes = Router();

// Get all products
productRoutes.get("/", (req, res) => {
  res.json({
    message: "Get all products",
  });
});

module.exports = productRoutes;
