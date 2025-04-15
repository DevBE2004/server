const mongoose = require("mongoose");

var newSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    newPic: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["ENABLE", "DISABLE"],
      default: "DISABLE",
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("New", newSchema);
