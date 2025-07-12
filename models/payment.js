// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  totalAmount:    Number,
  amountPaid:     Number,
  paymentDate:    Date,
  nextPaymentDate: Date,
  status:         { type: String, enum: ['paid', 'due'], default: 'due' },



  items: [{
    name: String,
    quantity: Number,
    pricePerUnit: Number,
    totalPrice: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },

  //ye abhi new addd kr rha hu
   billStatus: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'updated'],
    default: 'pending'
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
