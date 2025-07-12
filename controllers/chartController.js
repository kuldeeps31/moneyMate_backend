const Customer = require("../models/Customer");






//exports.DashChart = async (req, res) => {
//  try {
//    const currentYear = new Date().getFullYear();
//    const startDate = new Date(`${currentYear}-01-01`);
//    const endDate = new Date(`${currentYear + 1}-01-01`);

//    // Monthly Revenue
//    const monthlyRevenue = await Customer.aggregate([
//      {
//        $match: {
//          paymentDate: { $gte: startDate, $lt: endDate }
//        }
//      },
//      {
//        $group: {
//          _id: { month: { $month: "$paymentDate" } },
//          totalRevenue: { $sum: "$paidAmount" }
//        }
//      },
//      {
//        $sort: { "_id.month": 1 }
//      }
//    ]);

//    // Customer Count Monthly
//    const customerGrowth = await Customer.aggregate([
//      {
//        $match: {
//          createdAt: { $gte: startDate, $lt: endDate }
//        }
//      },
//      {
//        $group: {
//          _id: { month: { $month: "$createdAt" } },
//          totalCustomers: { $sum: 1 }
//        }
//      },
//      {
//        $sort: { "_id.month": 1 }
//      }
//    ]);

//    // Paid vs Unpaid
//    const paidUnpaid = await Customer.aggregate([
//      {
//        $group: {
//          _id: null,
//          totalPaid: { $sum: "$paidAmount" },
//          totalUnpaid: { $sum: "$balanceAmount" }
//        }
//      }
//    ]);

//    res.status(200).json({
//      monthlyRevenue,
//      customerGrowth,
//      paidUnpaid: paidUnpaid[0] || { totalPaid: 0, totalUnpaid: 0 }
//    });
//  } catch (err) {
//    res.status(500).json({ message: "Dashboard summary fetch failed", error: err });
//  }
//};


// controllers/dashboardController.js
const Payment = require("../models/Payment");


exports.getMonthlyRevenueAndSales = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const revenue = await Payment.aggregate([
      {
        $match: {
          paymentDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" }
          },
          revenue: { $sum: "$amountPaid" },       // पैसा जो आया
         sales: {
      $sum: {
        $sum: "$items.totalPrice" // ✅ Sum of all items in that month
      }
    }        // बिक्री जितनी हुई
        }
      },
      {
        $sort: { "_id.month": 1 }
      }
    ]);

    const revenueData = Array(12).fill(0);
    const salesData = Array(12).fill(0);

    revenue.forEach(entry => {
      const index = entry._id.month - 1;
      revenueData[index] = entry.revenue;
      salesData[index] = entry.sales;
    });

    res.json({ success: true, revenue: revenueData, sales: salesData });
  } catch (err) {
    console.error("Error in getMonthlyRevenueAndSales:", err);
    res.status(500).json({ success: false, message: "Failed to fetch chart data" });
  }
};

//for getting montly customer..


exports.getMonthlyCustomerGrowth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const [monthlyGrowth, totalCount] = await Promise.all([
      Customer.aggregate([
        {
          $match: {
            addedDate: {
              $gte: new Date(`${currentYear}-01-01`),
              $lte: new Date(`${currentYear}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { month: { $month: "$addedDate" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id.month": 1 } }
      ]),
      Customer.countDocuments()
    ]);

    const monthlyData = Array(12).fill(0);
    monthlyGrowth.forEach(entry => {
      monthlyData[entry._id.month - 1] = entry.count;
    });

    res.json({ success: true, data: monthlyData, total: totalCount });
  } catch (err) {
    console.error("Customer Stats Error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch customer stats" });
  }
};
