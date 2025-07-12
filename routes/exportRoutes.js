const express = require("express");
const router = express.Router();
const exportController = require("../controllers/exportController");
const auth = require("../middlewares/authMiddleware");
const exportLimiter = require("../middlewares/rateLimiter");

router.get("/customers", auth, exportLimiter, exportController.exportAllCustomers);
router.get("/customer/:id", auth, exportLimiter, exportController.exportCustomerHistory);

module.exports = router;

