const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    originalPrice: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    productPics: [String],
    quantity: {
      type: Number,
      required: true,
    },
    directory: { type: mongoose.Types.ObjectId, ref: "Directory" },
    isLiquidation: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
      require: true,
    },
    origin: {
      type: String,
      require: true,
    },
    introduce: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
