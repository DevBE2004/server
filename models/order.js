const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    status: {
      type: String,
      default: "UNPAID",
      enum: ["UNPAID", "PAID"],
    },
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    orderIdMomo: { type: String },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
