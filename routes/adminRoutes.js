const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware"); // already used
const { getAdminProfile } = require("../controllers/adminController");

router.get("/profile", authMiddleware, getAdminProfile);

module.exports = router;
