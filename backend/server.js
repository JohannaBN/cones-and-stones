import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/Cones&Stones";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Create product mongoose-schema & model
// Destructure schema & model
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  sizes: {
    type: [String], // Array of strings to handle sizes like "80/86", "90/96"
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["bottoms", "tops", "dresses", "accessories"], // Only allow specific categories
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

// Middleware to check if database in a good state, get the next, otherwise error-message
const checkDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
};

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(checkDatabaseConnection);

// Start defining your routes here
// http://localhost:8080/
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// GET all products
// http://localhost:8080/products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length > 0) {
      res.status(200).json({
        success: true,
        response: products,
        message: "Products retrieved successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        response: error,
        message: "No products found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Internal server error",
    });
  }
});

// GET single product by id
// http://localhost:8080/products/:productId
app.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).exec();
    if (product) {
      res.status(200).json({
        success: true,
        response: product,
        message: "Product was found successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        response: error,
        message: "Product not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Internal server error",
    });
  }
});

// GET products by category
// http://localhost:8080/products/category/:category
app.get("/products/category/:category"),
  async (req, res) => {
    const { category } = req.params;
    const validCategories = ["bottoms", "tops", "dresses", "accessories"];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        response: error,
        message: "Invalid category",
      });
    }

    try {
      const productsByCategory = await Product.find({ category });
      if (productsByCategory.length > 0) {
        res.status(200).json({
          success: true,
          response: productsByCategory,
          message: "Products retrieved successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          response: error,
          message: "No products found in this category",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        response: error,
        message: "Internal server error",
      });
    }
  };

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
