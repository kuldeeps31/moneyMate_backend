const Customer = require("../models/Customer");
const { sendWhatsAppMessage } = require("../services/whatsappService");
const WhatsAppLog = require("../models/WhatsAppLog");
const Payment = require("../models/payment"); // Import this at the top

//ye purana hai..

exports.buildWhatsAppMessage = function (
  name,
  items,
  total,
  paid,
  remaining,
  nextDate,
  billDate,
  previousDue = 0
) {
  const formattedDate = new Date(billDate).toLocaleDateString("hi-IN");

  const header = `\`\`\`
Items      Qty   Rate   Total
-------------------------------
\`\`\``;


  const itemRows = items
    .map((item) => {
      const itemName = item.name.padEnd(16);                            // 16 chars
      const qty = String(item.quantity).toString().padStart(3).padEnd(5); // 5 chars
      const rate = `₹${item.pricePerUnit}`.padStart(5).padEnd(7);        // 7 chars
      const total = `₹${item.totalPrice}`.padStart(7);                   // 7 chars
      return `\`\`\`${itemName}${qty}${rate}${total}\`\`\``;
    })
    .join("\n");

  return `
🧾  - दिनांक: ${formattedDate}

नमस्ते *${name}*, आपका आज का ऑर्डर सफलतापूर्वक दर्ज हो गया है।

📦 *आइटम विवरण:*                                        
${header}${itemRows}


🧮 *आज का टोटल*: ₹${total}   
💳 *पिछला बकाया*: ₹${previousDue}                           
💰 *आज का भुगतान*: ₹${paid}
📌 *कुल बकाया*: ₹${remaining}
                                                           


🙏 धन्यवाद! फिर से पधारिए 🙏
`;
};




//ye nya hai


//ye purana haii..

exports.addCustomer = async (req, res) => {

  try {

    const { name, phone, address, paidAmount, nextPaymentDate, items } = req.body;

    const enrichedItems = items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.pricePerUnit,
    }));

    const totalAmount = enrichedItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const remainingAmount = totalAmount - paidAmount;

    if (remainingAmount < 0) {
      return res.status(400).json({ message: "Paid amount cannot exceed total amount" });
    }
 //if date is not send from frontend..
    const fallbackNextDate = new Date(req.body.paymentDate || new Date());
    fallbackNextDate.setMonth(fallbackNextDate.getMonth() + 1);

    const finalNextPaymentDate = remainingAmount > 0 
      ? (nextPaymentDate || fallbackNextDate)
      : null;

    let customer = await Customer.findOne({ phone });

    if (customer) {
      customer.totalAmount += totalAmount;
      customer.paidAmount += paidAmount;
      customer.remainingAmount = customer.totalAmount - customer.paidAmount;
      customer.nextPaymentDate = customer.remainingAmount > 0 ? nextPaymentDate : null;
      customer.isSent = false;
      await customer.save();

      await Payment.create({
        userId: customer._id,
        totalAmount,
        amountPaid: paidAmount,
       paymentDate: req.body.paymentDate ? new Date(req.body.paymentDate) : new Date(),//isse ye ho rha hai kya agar customer payment dega
        nextPaymentDate,
        status: customer.remainingAmount === 0 ? "paid" : "due",
        items: enrichedItems,
      });

      return res.status(200).json({ message: "Existing customer updated successfully", customer });
    }

    const newCustomer = await Customer.create({
      name,
      phone,
      address,
      totalAmount,
      paidAmount,
      remainingAmount,
nextPaymentDate: remainingAmount > 0 
  ? (nextPaymentDate || new Date(new Date().setMonth(new Date().getMonth() + 1))) 
  : null,
      isSent: false
    });

    await Payment.create({
      userId: newCustomer._id,
      totalAmount,
      amountPaid: paidAmount,
      paymentDate: new Date(),
      nextPaymentDate: remainingAmount > 0 ? nextPaymentDate : null,
      status: remainingAmount === 0 ? "paid" : "due",
      items: enrichedItems,
    });

    newCustomer.isSent = false;
    await newCustomer.save();

    return res.status(201).json({ message: "Customer added successfully", customer: newCustomer });
  } catch (err) {
    console.error("❌ Error in addCustomer:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getCustomerByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ customer });
  } catch (err) {
    console.error("Error in getCustomerByPhone:", err);
    res.status(500).json({ message: "Server error" });
  }
};



//the format in which
exports.listCustomers = async (req, res) => {
  try {
    // 1) Read query params
    const {
      page = 1,
      limit = 10,
      search = '',
      dateFrom,
      dateTo,
      month,
    } = req.query;

    const filters = {};

    // 2) Text search by name (case‐insensitive)
    if (search) {
      filters.name = { $regex: search, $options: 'i' };
    }

    // 3) Date range filter on addedDate
    if (dateFrom || dateTo) {
      filters.addedDate = {};
      if (dateFrom) filters.addedDate.$gte = new Date(dateFrom);
      if (dateTo)   filters.addedDate.$lte = new Date(dateTo);
    }

    // 4) Month filter (YYYY-MM)
    if (month) {
      const [y, m] = month.split('-'); // e.g. "2025-06"
      filters.addedDate = {
        $gte: new Date(y, m - 1, 1),
        $lt:  new Date(y, m, 1)
      };
    }

    // 5) Count total matching
    const total = await Customer.countDocuments(filters);

    // 6) Fetch page of customers, sorted by newest first
    const customers = await Customer.find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // 7) Send response
    res.json({
      page:      parseInt(page),
      limit:     parseInt(limit),
      total,
      pages:     Math.ceil(total / limit),
      customers, // array of docs
    });
  } catch (err) {
    console.error('Error in listCustomers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


//for deleting cutomers
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Check if customer exists
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // 2. Delete all payments associated with the customer
    await Payment.deleteMany({ userId: id });

    // 3. Delete the customer
    await Customer.findByIdAndDelete(id);

    res.status(200).json({ message: 'Customer and payment history deleted successfully' });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: 'Internal server error' });
  }

};

 exports.updateCustomer = async (req, res) => {
 console.log("🔥 HIT updateCustomer route");
  console.log("🆔 ID received:", req.params.id);
  console.log(req.id);
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({
      message: 'Customer updated successfully',
      customer: updatedCustomer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.sendReminder = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // ✅ Common Message Format
    const message = `📢 Dear ${customer.name}, your payment of ₹${customer.totalAmount - customer.paidAmount} is still pending. Please pay soon.
    
    प्रिय ${customer.name}, आपका ₹${customer.totalAmount - customer.paidAmount} का भुगतान अभी बाकी है। कृपया जल्द भुगतान करें।

🙏 धन्यवाद!
    `;

    // ✅ Send to Customer
    await sendWhatsAppMessage(`+91${customer.phone}`, message);

    // ✅ Owner Message Format
    const ownerMessage = `📬 Reminder sent to ${customer.name} (${customer.phone}) for pending amount ₹${customer.totalAmount - customer.paidAmount}.`;

    // ✅ Send to Owner
    await sendWhatsAppMessage(process.env.OWNER_PHONE, ownerMessage);

    res.status(200).json({ message: "Reminder sent!" });
  } catch (err) {
    console.error("Reminder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


