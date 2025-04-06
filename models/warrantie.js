const mongoose = require("mongoose");

var warrantieSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      unique: true,
    },
    durationMonths: {
      type: Number,
      required: true,
    },
    //điều khoản bảo hành
    terms: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warrantie", warrantieSchema);
