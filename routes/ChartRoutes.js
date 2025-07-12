const express = require('express');
const router = express.Router();
//const dashboardController = require('../controllers/getDashboardChart');
//const {DashChart}=require('../controllers/chartController');
const verifyToken = require('../middlewares/authMiddleware');

//router.get('/Charts', verifyToken,DashChart );

const { getMonthlyRevenueAndSales,getMonthlyCustomerGrowth } = require("../controllers/chartController");

router.get("/revenue-and-sales",verifyToken, getMonthlyRevenueAndSales);
router.get("/customer-growth", verifyToken, getMonthlyCustomerGrowth);
module.exports = router;
