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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
