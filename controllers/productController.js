const productModel = require("../models/productModel");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const addProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can add products.",
      });
    }

    const { name, description, price, category, stock } = req.body;
    let image;
    if (req.files["image"][0]) {
      image = await cloudinary.uploader.upload(req.files["image"][0].path);
    }
    let images = [];
    if (req.files["images"]) {
      const imagesFiles = req.files["images"].map((file) => file.path);

      if (imagesFiles && imagesFiles.length > 0) {
        for (const file of imagesFiles) {
          const uploadedImage = await cloudinary.uploader.upload(file);
          images.push(uploadedImage.secure_url);
        }
      }
    }
    const newProduct = new productModel({
      name,
      description,
      price,
      category,
      stock,
      image: image ? image.secure_url : null,
      images: images.length > 0 ? images : null,
    });
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can delete products.",
      });
    }
    const { id } = req.params;

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found. Unable to delete.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can update products.",
      });
    }

    const { id } = req.params;

    const { name, description, price, category, stock } = req.body;

    let updates = { name, description, price, category, stock };

    if (req.files["image"]?.[0]) {
      const uploadedImage = await cloudinary.uploader.upload(
        req.files["image"][0].path
      );
      updates.image = uploadedImage.secure_url;
    }

    if (req.files["images"]) {
      const imagesFiles = req.files["images"].map((file) => file.path);

      if (imagesFiles.length > 0) {
        updates.images = [];
        for (const file of imagesFiles) {
          const uploadedImage = await cloudinary.uploader.upload(file);
          updates.images.push(uploadedImage.secure_url);
        }
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found. Unable to update.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product.", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await productModel
      .find({})
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProducts = await productModel.countDocuments();
    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products.", error: error.message });
  }
};

const getProductsWithFilter = async (req, res) => {
  try {
      let query = {};

      
      if (req.query.category) {
          query.category = req.query.category; 
      }
      if (req.query.minPrice !== undefined && req.query.maxPrice !== undefined) {
          query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice }; 
      } else if (req.query.minPrice !== undefined) {
          query.price = { $gte: req.query.minPrice }; 
      } else if (req.query.maxPrice !== undefined) {
          query.price = { $lte: req.query.maxPrice }; 
      }
      if (req.query.inStock !== undefined) {
          query.stock = req.query.inStock ? { $gt: 0 } : 0; 
      }

      if (req.query.name) {
          query.name = { $regex: req.query.name, $options: "i" }; 
      }

      let sortCriteria = {};
      if (req.query.sortBy) {
          sortCriteria[req.query.sortBy] = req.query.sortOrder === "desc" ? -1 : 1; 
      }

      const products = await productModel.find(query).sort(sortCriteria);

      res.status(200).json({ products, total: products.length });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const productController = {
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getAllProducts,
  getProductsWithFilter,
};

module.exports = productController;
