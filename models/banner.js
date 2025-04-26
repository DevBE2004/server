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
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
