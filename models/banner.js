const mongoose = require("mongoose");

var bannerSchema = new mongoose.Schema(
  {
    bannerPic: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ENABLE", "DISABLE"],
      default: "ENABLE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
