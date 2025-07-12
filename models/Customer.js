

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  pricePerUnit: Number,
  totalPrice: Number // quantity * pricePerUnit
});

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, 
     match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
  },
  address: { type: String, default: "" },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  remainingAmount: { type: Number, required: true },
  nextPaymentDate: { type: Date },
  addedDate: { type: Date, default: Date.now },
  items: [itemSchema],
  isSent: { type: Boolean, default: false },
sendTime: { type: Date }
}, { timestamps: true });



module.exports = mongoose.model("Customer", customerSchema);
