const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [1000, "Product description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "Electronics",
        "Fashion",
        "Books",
        "Toys",
        "Home",
        "Food",
        "Other",
      ],
      default: "Other",
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
