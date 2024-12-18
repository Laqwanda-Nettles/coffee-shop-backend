# Coffee Shop Backend

[Part 2: JWT User Authentication & Protected Routes](#coffee-shop-backend---part-2)

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

---

# Coffee Shop Backend - Part 2

## Overview

This section builds upon the Coffee Shop Backend by adding user authentication functionality using JSON Web Tokens (JWT). The main features include:

- Setting up user authentication with JWT.
- Implementing registration and login endpoints.
- Protecting routes using authentication middleware.
- Testing the API.

## Setup

### Additional Dependencies

To enable user authentication, the following dependencies were installed:

```bash
npm install bcryptjs jsonwebtoken
```

### Environment Variables

Updated `.env` file to include the following variables:

```env
MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
```

### User Model

The `User` model was created in `models/user.js` to define the schema for user data and manage password hashing.

```javascript
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["user", "admin"] },
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
```

## Implementing Registration and Login Endpoints

### Routes

Authentication routes were implemented in `routes/auth.js` to handle user registration and login.

#### Register a User

```javascript
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

#### Login a User

```javascript
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Creating Authentication Middleware

The middleware `auth` was created in `middleware/auth.js` to protect routes by verifying JWT tokens.

```javascript
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  let token;

  try {
    token = req.header("Authorization").replace("Bearer ", "");
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authorization header is missing." });
  }

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = auth;
```

## Integrating Routes with the Server

The `auth` routes and middleware were integrated into the server in `index.js`:

```javascript
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const auth = require("./middleware/auth");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Authentication routes
app.use("/auth", authRoutes);

// Protect product routes
app.use("/products", auth, productRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```

## Testing the API

The API was tested using Thunder Client. Below are the steps and screenshots:

### 1. Register a User

**Method:** POST  
**URL:** `http://localhost:3000/auth/register`  
**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Screenshot:**  
 ![Register User](image-8.png)

### 2. Login a User

**Method:** POST  
**URL:** `http://localhost:3000/auth/login`  
**Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Screenshot:**  
![Login User](image-9.png)

### 3. Access Protected Product Routes

**Method:** GET  
**URL:** `http://localhost:3000/products`  
**Headers:**

```plaintext
Authorization: Bearer <your_jwt_token>
```

**Screenshot:**  
![Get All Products (Protected Route)](image-7.png)
