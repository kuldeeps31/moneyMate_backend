const express = require('express');
const router = express.Router();
const authMiddleware=require('../middlewares/authMiddleware');


const {
  getDashboardSummary,
  getUpcomingPayments,
} = require('../controllers/dashboardController');
//const authMiddleware = require('../middleware/authMiddleware');

// GET /api/dashboard/summary
router.get('/summary', authMiddleware, getDashboardSummary);

// GET /api/dashboard/upcoming
router.get('/upcoming', authMiddleware, getUpcomingPayments);

module.exports = router;
