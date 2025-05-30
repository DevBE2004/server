const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var directorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    category: [
      { type: mongoose.Types.ObjectId, ref: "Category", required: true },
    ],
    directoryPic: { type: String, required: true },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Directory", directorySchema);
