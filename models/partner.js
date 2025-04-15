const mongoose = require("mongoose");

var partnerSchema = new mongoose.Schema(
  {
    partnerPic: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
