
const express=require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path')
const helmet = require("helmet");
const morgan = require("morgan");



const rateLimit = require("express-rate-limit");

const exportLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 3, // max 3 exports per user
  message: "Too many export requests. Please wait.",
});


dotenv.config();
connectDB();


const app = express();






 
//app.use(
//  cors({
//    origin: process.env.FRONTEND_URL ,
//    credentials: true
//  })
//);


const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors({
  origin: allowedOrigin,
  credentials: true
}));





app.use(express.json());


//app.get('/admin/profile-pic', (req, res) => {
//  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
//  res.sendFile(path.join(__dirname, 'public', 'adminPic.jpeg'));
//});s



app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "http://localhost:8080"], // 👈 Allow your backend image URL
      },
    },
  })
);



if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}



app.use(
  '/public',
  cors({ origin: process.env.FRONTEND_URL, credentials: true }),
  express.static(path.join(__dirname, 'public'))
);

// ✅ Import & start the scheduler
//const scheduleReminders = require("./services/cronJob");
//scheduleReminders(); // 🔁 Start the daily reminder task

app.use('/api/auth', require('./routes/authRoutes'));
//for customers..
app.use('/api/customers', require('./routes/customerRoutes'));

app.use('/api/payment', require('./routes/paymentRoutes'));

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);
app.get('/', (req, res) => res.send('✅ Server running securely!'));

//for photo
app.use('/api/admin',require('./routes/adminRoutes'));

//for excel
const exportRoutes = require("./routes/exportRoutes");
app.use("/api/export", exportRoutes);

//for fropdown

const itemRoutes=require('./routes/itemRoutes');
app.use("/api",itemRoutes);

// ⏰ Start Cron Job
require("./services/sendWhatsAppBills");

//fro chart
app.use('/api/Chart', require('./routes/ChartRoutes'));
const PORT = process.env.PORT ;


app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

