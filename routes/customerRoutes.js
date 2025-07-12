const express = require("express");
const router = express.Router();
const { addCustomer,listCustomers,deleteCustomer,updateCustomer,sendReminder } = require("../controllers/customerController");
const authMiddleware = require('../middlewares/authMiddleware');
const {getCustomerById}=require('../controllers/paymentController')
//const exportController = require("../controllers/exportController");
//const exportLimiter = require("../middlewares/rateLimiter");



//to add customers..
router.post("/add",authMiddleware, addCustomer);

// to get all thhe customers..
router.get('/', authMiddleware, listCustomers);

//to get particular customer
router.get('/:id', authMiddleware, getCustomerById);
//to delete customer..
router.delete('/customers/:id',authMiddleware, deleteCustomer);

// Update customer
router.put('/:id', authMiddleware, updateCustomer);


router.post("/reminder/:id", authMiddleware, sendReminder);

////for export 
//router.get("/customers", authMiddleware, exportLimiter, exportController.exportAllCustomers);
//router.get("/customer/:id", authMiddleware, exportLimiter, exportController.exportCustomerHistory);

module.exports = router;

