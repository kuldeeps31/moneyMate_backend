const mongoose = require("mongoose");

const whatsappLogSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["add_customer", "payment_reminder", "payment_update"],
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("WhatsAppLog", whatsappLogSchema);
