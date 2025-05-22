const mongoose = require("mongoose");
const InventoryItem = require("../models/item");
const Model = mongoose.model("items");

// GET: /inventory-items - lists all the inventory items
// Regardless of outcome, response must include HTTP status
// code and JSON message to the requesting client
const inventoryItems = async (req, res) => {
  if (!req.auth.userId) {
    return res.status(401).json("Not authorized");
  }
  try {
    const query = await Model.find({ userId: req.auth.userId }) // Filter by user ID
      .exec();

    if (!query) {
      // Database returned no data
      return res.status(404).json("Database error");
    } else {
      // Return resulting item list
      return res.status(200).json(query);
    }
  } catch (err) {
    return res.status(500).json("Server error");
  }
};

// GET: /inventory-items/:id - lists a single item
// Regardless of outcome, response must include HTTP status code
// and JSON message to the requesting client
const itemsFindById = async (req, res) => {
  if (!req.params.id || !req.auth.userId) {
    return res.status(400).json("Invalid Request");
  }
  try {
    // First check if item exists at all
    const itemExists = checkItemExists(req.params.id);

    if (!itemExists) {
      return res.status(404).json("Item not found");
    }

    // Then check if it belongs to the user
    const query = await Model.findOne({
      _id: req.params.id,
      userId: req.auth.userId,
    }) // Returns single record
      .exec();

    if (!query && itemExists) {
      // Item exists but doesn't belong to user
      return res.status(403).json("Unauthorized access to item");
    } else {
      // Return resulting item record
      return res.status(200).json(query);
    }
  } catch (err) {
    return res.status(500).json("Server error");
  }
};

// POST: /inventory-items - adds a new item to the database
// Regardless of outcome, response must include HTTP status code
// and JSON message to the requesting client
const itemsAddItem = async (req, res) => {
  if (!req.body.name || !req.body.quantity || !req.auth.userId) {
    return res.status(400).json("Invalid Request");
  }
  try {
    const inventoryItem = new InventoryItem({
      name: req.body.name,
      quantity: req.body.quantity,
      userId: req.auth.userId,
    });

    const query = await inventoryItem.save();

    if (!query) {
      // Database returned no data
      return res.status(400).json("Database error");
    } else {
      // Database returned new item
      return res.status(201).json(query);
    }
  } catch (err) {
    return res.status(500).json("Server error");
  }
};

// PUT: /inventory-items/:id - Updates an item
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const itemsUpdateItem = async (req, res) => {
  if (
    !req.body.name ||
    req.body.quantity === undefined ||
    req.body.quantity === null ||
    !req.auth.userId
  ) {
    return res.status(400).json("Invalid Request");
  }
  try {
    // First check if item exists at all
    const itemExists = checkItemExists(req.params.id);

    if (!itemExists) {
      return res.status(404).json("Item not found");
    }
    const query = await Model.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.userId },
      {
        name: req.body.name,
        quantity: req.body.quantity,
      },
      { new: true } // This option returns the updated document
    ).exec();

    if (!query && itemExists) {
      // Database returned no data
      return res.status(403).json("Unauthorized access to item");
    } else {
      // Return resulting updated item
      return res.status(201).json(query);
    }
  } catch (err) {
    return res.status(500).json("Server error");
  }
};

// DELETE: /inventory-item/:id - Deletes a Item
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const itemsDeleteItem = async (req, res) => {
  if (!req.params.id || !req.auth.userId) {
    return res.status(400).json("Invalid Request");
  }
  try {
    // First check if item exists at all
    const itemExists = checkItemExists(req.params.id);

    if (!itemExists) {
      return res.status(404).json("Item not found");
    }
    // Find the Item to delete (by id and user id)
    const query = await Model.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.userId,
    }).exec();
    if (!query && itemExists) {
      return res.status(403).json("Unauthorized access to item");
    } else {
      return res.status(204).json(query);
    }
  } catch (err) {
    return res.status(500).json("Server error");
  }
};

const checkItemExists = async (id) => {
  const itemExists = await Model.exists({ _id: id });
  if (!itemExists) {
    return false;
  }
  return true;
};

module.exports = {
  inventoryItems,
  itemsFindById,
  itemsAddItem,
  itemsUpdateItem,
  itemsDeleteItem,
};
