# Coffee Shop Backend

## Overview / Objective

The Coffee Shop Backend is a Node.js-based Express application that serves as the backend for an e-commerce coffee shop. It provides APIs for managing products with full CRUD (Create, Read, Update, Delete) functionality. The backend uses MongoDB with Mongoose for database operations, allowing efficient storage and retrieval of product data.

### Key Features

- **CRUD Operations**: Implemented APIs for managing products, including creating, reading, updating, and deleting.
- **MongoDB Integration**: Utilizes Mongoose for schema definition and database interactions.
- **Scalability**: Provides a modular design with separation of concerns for easier maintenance and extensibility.

## Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (v16 or higher)
- MongoDB (local or cloud-based like MongoDB Atlas)

### Steps to Set Up the Project

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd coffee-shop-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and set your MongoDB connection string:

   ```env
   MONGO_URL=your-mongodb-connection-string
   ```

4. Start the server:

   - For development (using `nodemon`):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

5. Test the server:
   Open a browser or API client (e.g., Thunder Client, Postman) and navigate to `http://localhost:3000`.

## Defining the Product Model

The product schema is defined in `models/product.js`. It includes the following fields:

- **name**: String, required
- **description**: String, required
- **price**: Number, required
- **category**: String, required
- **stock**: Number
- **imageUrl**: String

### Example Code:

```javascript
const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number },
  imageUrl: { type: String },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
```

## Implementing Basic CRUD Operations

### Process

1. **Foundation Route**: A base route was created to verify the setup using Thunder Client:

   ```javascript
   router.get("/", (req, res) => {
     res.json({ message: "Get all products" });
   });
   ```

2. **CRUD Routes**:
   - **POST `/products`**: Create a new product.
   - **GET `/products`**: Retrieve all products.
   - **GET `/products/:id`**: Retrieve a product by ID.
   - **PUT `/products/:id`**: Update a product by ID.
   - **DELETE `/products/:id`**: Delete a product by ID.

### Example Code:

- **Get All Products**:

  ```javascript
  productRoutes.get("/", async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  ```

- **Delete a Product by ID**:
  ```javascript
  productRoutes.delete("/:id", async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res
        .status(200)
        .json({ message: "Product deleted successfully", product });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  ```

### Testing the Routes

1. **Create a Product**:

   - Method: POST
   - URL: `http://localhost:3000/products`
   - Body (JSON):
     ```json
     {
       "name": "Coffee Mug",
       "description": "A large coffee mug.",
       "price": 12.99,
       "category": "mugs",
       "stock": 100,
       "imageUrl": "http://example.com/mug.jpg"
     }
     ```
   - **Screenshots:**  
     ![Adding A Product](image.png)

     ![Product Saved to Database](image-1.png)

2. **Retrieve All Products**:

   - Method: GET
   - URL: `http://localhost:3000/products`
   - **Screenshots:**  
     ![Get All Products](image-2.png)

3. **Retrieve a Single Product by ID**:

   - Method: GET
   - URL: `http://localhost:3000/products/<product_id>`
   - **Screenshots:**  
     ![Get by Id](image-3.png)

4. **Update a Product**:

   - Method: PUT
   - URL: `http://localhost:3000/products/<product_id>`
   - Body (JSON):
     ```json
     {
       "name": "Large Coffee Mug",
       "description": "A large coffee mug, perfect for your morning coffee.",
       "price": 14.99,
       "stock": 50
     }
     ```
   - **Screenshots:**  
     ![Update Product](image-4.png)

     ![Update Saved to Database](image-5.png)

5. **Delete a Product**:
   - Method: DELETE
   - URL: `http://localhost:3000/products/<product_id>`
   - **Screenshots:**  
     ![Delete Product by Id](image-6.png)

### Workflow

Each foundational route was first tested individually to ensure proper setup and functioning. After verification, additional CRUD routes were implemented and tested one by one. This step-by-step approach ensured a consistent workflow and helped to limit errors during development.

## Testing the API

Testing was conducted using Thunder Client for all routes:

- Verified each route individually during implementation.
- Validated request and response payloads for correctness.
- Screenshots were taken for POST, GET, PUT, and DELETE operations for submission.

### Example Commands for Debugging

To debug errors during testing, use:

```bash
npm run dev
```

Inspect the console for error logs during API interactions.

## What I’ve Learned

- **Consistent Workflow**: Implementing and testing routes one by one allowed for a streamlined development process and minimized potential issues.
- **Error Handling**: Debugging using console logs and inspecting response payloads helped in identifying and resolving errors efficiently.
- **Mongoose Integration**: Leveraging Mongoose for schema validation and database operations simplified data handling.

## Completion

This assignment fulfilled all the requirements:

- Setting up the Express project.
- Connecting to MongoDB using Mongoose.
- Defining the Product model.
- Implementing and testing CRUD operations for the products API.
