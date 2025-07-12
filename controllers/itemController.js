const Item = require("../models/Item");

// ➕ Add item (optional if admin panel banayega)
exports.addItem = async (req, res) => {
  try {
    const { name } = req.body;


    if (!name) {
      return res.status(400).json({ success: false, message: "Item name is required" });
    }

    const existing = await Item.findOne({ name: name.trim() });
    if (existing) {
      return res.status(200).json({ success: true, message: "Item already exists", item: existing });
    }

    const item = await Item.create({ name: name.trim() });

    res.status(201).json({ success: true, message: "Item added", item });
  } catch (err) {
    console.error("Error in addItem:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 📥 Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 }); // A-Z
    res.status(200).json({ success: true, items });
  } catch (err) {
    console.error("Error in getAllItems:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  DELETE item by ID
exports.deleteItem = async (req, res) => {
    console.log("hitt");
  try {
    const itemId = req.params.id;
    await Item.findByIdAndDelete(itemId);
    res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};