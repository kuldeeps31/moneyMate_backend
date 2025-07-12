//const express = require('express');
//const router = express.Router();
//const { createPayment } = require('../controllers/paymentController');

//router.post('/create', createPayment);

//module.exports = router;



const express = require("express");
const router = express.Router();
const { updatePayment,getCustomerWithHistory,getFilteredPayments,updateBill,sendBillManually } = require("../controllers/paymentController");
const authMiddleware = require('../middlewares/authMiddleware');

//to updates all the payment to pay the pending amount
router.post("/update", authMiddleware, updatePayment); 


//to gget payment details
//router.get("/customer/:userId", authMiddleware,getCustomerPaymentDetails);
router.get("/customer/:id", authMiddleware, getCustomerWithHistory);


// Get all pending bills for today
router.get("/today-pending",authMiddleware, getFilteredPayments);

// Edit/update a bill
router.put("/:id",authMiddleware, updateBill);

// Resend a bill manually
router.post("/:id/send-again",authMiddleware, sendBillManually);

//re-send all the bills of the day
//router.post("/:customerId/resend-all",authMiddleware, resendAllBillsForToday);
module.exports = router;

