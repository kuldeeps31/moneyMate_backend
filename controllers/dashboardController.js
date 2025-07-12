const Customer = require('../models/Customer');
const authMiddleware=require('../middlewares/authMiddleware');

// 1. Get Dashboard Summary


exports.getDashboardSummary = async (req, res) => {
  
  try {
    const customers = await Customer.find();

    const totalCustomers = customers.length;
    const totalPaid = customers.reduce((acc, c) => acc + c.paidAmount, 0);
    const totalRemaining = customers.reduce((acc, c) => acc + (c.totalAmount - c.paidAmount), 0);

//show current day peoples..
    const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const upcomingPayments = customers.filter(c => {
  const paymentDate = new Date(c.nextPaymentDate);
  return paymentDate >= today && paymentDate < tomorrow;
}).length;

    res.json({
      totalCustomers,
      totalPaid,
      totalRemaining,
      upcomingPayments,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};


exports.getUpcomingPayments = async (req, res) => {
  console.log('hit');
    console.log('Fetching today\'s payments');

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayPayments = await Customer.find({
      nextPaymentDate: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    })
    .sort({ nextPaymentDate: 1 })
    .select('name phone paidAmount totalAmount nextPaymentDate');

    const data = todayPayments.map((c) => ({
      _id: c._id,
      name: c.name,
      phone: c.phone,
      dueAmount: c.totalAmount - c.paidAmount,
      dueDate: c.nextPaymentDate,
    }));

    res.json(data);
  } catch (err) {
    console.error('Error fetching today\'s payments:', err);
    res.status(500).json({ message: 'Error fetching today\'s payments', error: err.message });
  }

};
