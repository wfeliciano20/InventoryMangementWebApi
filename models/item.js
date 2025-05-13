const mongoose = require("mongoose");

// Define the inventory Item schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  quantity: { type: Number, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

const InventoryItem = mongoose.model("items", itemSchema);

module.exports = InventoryItem;
