const express = require("express");
const router = express.Router();
const { addItem, getAllItems,deleteItem } = require("../controllers/itemController");

router.post("/items/add", addItem);       // For adding new item (optional)
router.get("/items", getAllItems);  
  // For getting all items
  router.delete("/items/:id", deleteItem); //for deleting items..

module.exports = router;